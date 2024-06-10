export const downloadFile = (data:string, fileName:string) => {
    const stringToBlob = new Blob([data])
    let reader = new FileReader()
    reader.readAsArrayBuffer(stringToBlob!)
    reader.onload = ((e:ProgressEvent<FileReader>) => {
        if(e.target !== null){
            const arrayBuffer = e.target.result as string
            const blob = new Blob([arrayBuffer], { type: 'application/jsonL' })
            const aElement = document.createElement('a');
            aElement.setAttribute('download', `openAI-format-${fileName}`);
            const href = window.URL.createObjectURL(blob);
            aElement.href = href;
            aElement.setAttribute('target', '_blank');
            aElement.click();
            window.URL.revokeObjectURL(href);
        }
    })
}