import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import UploadedFileDisplay from '../components/UploadedFileDisplay'
import FormattedDataDisplay from '../components/FormattedDataDisplay'
import { ModelData } from '../interfaces/interface'
import NewTab from '../assets/new-tab.png'
import { Link } from 'react-router-dom'

const Home = () => {


    const [fileName, setFileName] = useState('')
	const [fileData, setFileData] = useState('')
	const [openAIData, setOpenAIData] = useState('')
	const [systemContent, setSystemContent] = useState('You are a sarcastic robot that occassionally tells dad jokes.')
	const [userContent, setUserContent] = useState('What is the time?')
	const [assistantContent, setAssistantContent] = useState(`Oh, the time? Well, it's somewhere between "Time to get a watch" and "O'clock."`)
	const [isLoadingJson, setIsLoadingJson] = useState(false)
	const [dataKeys, setDataKeys] = useState<string[]>([])
	const [dropdownOptions, setOptions] = useState({
		user: '',
		assistant: ''
	})
    const [isDataError, setIsDataError] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)

	const handleInputClick = () => {
		if(inputRef.current !== null){
			inputRef.current.click()
		}
	}

	const handleDataManipulation = (data:any) => {
		let openAIDataFormat:ModelData[] = []
		data.forEach((value: { [x: string]: any }) => {
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
		
        const localData = localStorage.getItem('file')
		const formattedOpenAIData = openAIDataFormat.map((item: {[key:string]:any}) => JSON.stringify(item)).join('\n')
		//const formattedFileData = data.map((item: {[key:string]:any}) => JSON.stringify(item)).join('\n')
		
		setFileData(localData!)
		setOpenAIData(formattedOpenAIData)
	}


	useEffect(() => {
        try {
            const localData = JSON.parse(localStorage.getItem('file')!)
            if(fileData && localData){
                handleDataManipulation(localData)
            }
            setIsDataError(false)
        } catch (error) {
            setIsDataError(true)
        }
	}, [systemContent, userContent, assistantContent, dropdownOptions, fileData])
	
    
    

	const handleUpload = (e:any) => {
		if(e.target.files.length){
			setOpenAIData('')
			setFileData('')
            let file = e.target.files[0]
			let nameOfFile = e.target.files[0].name
            let reader = new FileReader()
			setIsLoadingJson(true)
            reader.onload = (e:any) =>{
				localStorage.setItem('file', e.target.result)
                let data = JSON.parse(e.target.result)
				if(data.length > 0){
					setDataKeys(Object.keys(data[0]))
					localStorage.setItem('keys', JSON.stringify(Object.keys(data[0])))
				}
				if(!data.length){
					toast.error('File is not an array or array is empty')
					return
				}
				handleDataManipulation(data)
				setFileName(nameOfFile)
            }
			reader.readAsText(file)
			reader.onloadend = () => {
				setIsLoadingJson(false)
			}
        }
	}


	useEffect(() => {
		const keys = localStorage.getItem('keys')
		if(keys && fileData){
			setDataKeys(JSON.parse(keys))
		}
	}, [])

    
    return (
        <div className='max-width m-auto'>
			<h1 className='text-center mt-10'>Format data for finetuning on OpenAI</h1>
			<div className='mt-10'>
				<div className='flex justify-between'>
                    <div>
                        <input className='hidden' accept='.json' onChange={handleUpload} type='file' ref={inputRef} />
                        <div className='flex flex-wrap items-center gap-4'>
                            <button onClick={handleInputClick} className=''>Upload JSON</button>
                            <span>{ fileName }</span>
                        </div>
                        <p className='mt-5 '>
                            Have CSV/Excel instead? &nbsp;
                            <a target='_blank' href='https://excel2json.io' className=''> 
                                Convert to json 
                                <img src={NewTab} width={20} className='shrink-0 inline ml-1'/> 
                            </a>
                        </p>
                    </div>
                    <div className='mt-5'>
                        <Link to='/validations'>Run Validations On JSONL File</Link>
                    </div>
                </div>
			</div>
			<div className='mt-10'>
				<div className='flex flex-col md:flex-row justify-between gap-5'>
					<div className='flex-1' >
						<h2 className='mb-2'>System message</h2>
						<textarea className='w-full' rows={4} onChange={(e) => setSystemContent(e.target.value)} value={systemContent}/>
					</div>
					<div className='flex-1' >
						<h2 className='mb-2'>User message</h2>
						<textarea className='w-full' rows={4} onChange={(e) => setUserContent(e.target.value)} value={userContent}/>
					</div>
					<div className='flex-1' >
						<h2 className='mb-2'>Assistant message</h2>
						<textarea  className='w-full'rows={4} onChange={(e) => setAssistantContent(e.target.value)} value={assistantContent} />
					</div>
				</div>
			</div>
			<div className='mt-10 flex flex-col lg:flex-row justify-between w-full gap-10 '>
				<UploadedFileDisplay isDataError={isDataError} dataKeys={dataKeys} getDropdownOptions={setOptions} fileData={fileData} setFileData={setFileData}/>
				<FormattedDataDisplay openAIData={openAIData} setOpenAIData={setOpenAIData} fileName={fileName} isLoadingJson={isLoadingJson}/>
			</div>
		</div>
    )
}

export default Home