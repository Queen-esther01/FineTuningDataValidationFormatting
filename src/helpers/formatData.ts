import { ModelData } from "../interfaces/interface"

const handleDataManipulation = (uploadedData:any) => {
    let openAIDataFormat:ModelData[] = []
    uploadedData.forEach((value: { [x: string]: any }) => {
        let dataToWrite:ModelData = {
            messages: [
                {
                    role: "system",
                    content: systemContent
                },
                {
                    role: "user",
                    content: `${userContent} ${dropdownOptions.user && value[dropdownOptions.user]}`
                },
                {
                    role: "assistant",
                    content: `${assistantContent} ${dropdownOptions.assistant && value[dropdownOptions.assistant]}`
                }
            ]
        }
        openAIDataFormat.push(dataToWrite)
    })
    
    const formattedOpenAIData = openAIDataFormat.map((item: {[key:string]:any}) => JSON.stringify(item)).join('\n')
    const formattedFileData = uploadedData.map((item: {[key:string]:any}) => JSON.stringify(item)).join('\n')
    
    setFileData(formattedFileData)
    setOpenAIData(formattedOpenAIData)
}