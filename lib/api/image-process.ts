"use server"

export default async function imageProcess(image: any) {
    "use server"
    console.log("Processing image:", image)

    return {
        success: true,
    }
}

