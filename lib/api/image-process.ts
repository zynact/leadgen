"use server"

import {fetch} from "undici";

export default async function imageProcess(images: File[]) {
    "use server"

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const MATTERMOST_WEBHOOK_URL = process.env.MATTERMOST_WEBHOOK_URL || "";

    try {
        const results = await Promise.all(images.map(async (image) => {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString("base64");

            const prompt = `Extract the 'posted by' and 'post content' from the image. Return a JSON object with 'postedBy', 'postContent' (in Markdown), and 'markdown_confidence' (0-100). If 'postedBy' is absent, use 'Author Unavailable'. The 'postContent' should be formatted in markdown.`;

            const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4.1",
                    input: [
                        {
                            role: "user",
                            content: [
                                {type: "input_text", text: prompt},
                                {
                                    type: "input_image",
                                    image_url: `data:image/jpeg;base64,${base64}`
                                }
                            ]
                        }
                    ]
                })
            });

            if (!openAIResponse.ok) {
                console.error("OpenAI API error:", await openAIResponse.text());
                return {success: false, error: "Failed to process image with OpenAI"};
            }

            const openAIResult: any = await openAIResponse.json();
            console.log("OpenAI API response received successfully", openAIResult.output[0].content[0]);
            const extractedText = openAIResult.output[0].content[0].text;
            let markdown;

            try {
                const cleaned = extractedText.replace(/```json\n?|\n?```/g, "").trim();
                const openAIJson = JSON.parse(cleaned);

                if (openAIJson.markdown_confidence < 50) {
                    return {success: false, error: "Markdown confidence too low"};
                }

                markdown = `### ${openAIJson.postedBy}\n${openAIJson.postContent}`;
            } catch (error) {
                markdown = extractedText;
            }

            console.log("Markdown content:", markdown);

            const mattermostResponse = await fetch(MATTERMOST_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text: markdown}),
            });

            if (!mattermostResponse.ok) {
                console.error("Mattermost webhook error:", await mattermostResponse.text());
                return {success: false, error: "Failed to send message to Mattermost"};
            }

            return {success: true, extractedText: markdown};
        }));

        return results;
    } catch (error) {
        console.error("Error processing image:", error);
        return {success: false, error: "Internal server error"};
    }
}

