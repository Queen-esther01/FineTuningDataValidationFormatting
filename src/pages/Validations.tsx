import React, { useRef, useState } from 'react'
import ChecksToBeDone from '../components/ChecksToBeDone'
import { Link } from 'react-router-dom'

const Validations = () => {

    const [ fileName, setFileName ] = useState('')
    const [isFileValidated, setIsFileValidated] = useState(false)
    const [errors, setErrors] = useState({
        'data_is_not_an_object': 0,
        'messages_key_missing': 0,
        'role_key_missing': 0,
        'content_key_missing': 0,
        'unrecognized_key': 0,
        'unrecognized_role': 0,
        'content_is_missing': 0,
        'content_is_not_a_string': 0,
        'missing_assistant_message': 0,
    })
    const [errorOccurence, setErrorOccurence] = useState<{[key:string]: string[]}>({
        'data_is_not_an_object': [],
        'messages_key_missing': [],
        'role_key_missing': [],
        'content_key_missing': [],
        'unrecognized_key': [],
        'unrecognized_role': [],
        'content_is_missing': [],
        'content_is_not_a_string': [],
        'missing_assistant_message': [],
    })
    
    const inputRef = useRef<HTMLInputElement>(null)

	const handleInputClick = () => {
		if(inputRef.current !== null){
			inputRef.current.click()
		}
	}

    // let errors:{[key:string]: number} = {
    //     'data_is_not_an_object': 0,
    //     'messages_key_missing': 0,
    //     'content_key_missing': 0,
    //     'unrecognized_key': 0,
    //     'unrecognized_role': 0,
    //     'content_is_missing': 0,
    //     'content_is_not_a_string': 0,
    //     'missing_assistant_message': 0,
    // }

    const handleUpload = (e:any) => {
		if(e.target.files.length){
            let file = e.target.files[0]
            let nameOfFile = e.target.files[0].name
            let reader = new FileReader()
            reader.onload = (e:any) =>{
                const lines = e.target.result.split('\n');
                lines.forEach((line:any) => {
                    if(line !== ''){
                        setIsFileValidated(true)
                        const jsonObject = JSON.parse(line)

                        //CHECK THAT DATA IS AN OBJECT
                        if(Array.isArray(jsonObject)){
                            setErrors({
                                ...errors,
                                'data_is_not_an_object': errors['data_is_not_an_object'] += 1
                            })
                            errorOccurence['data_is_not_an_object'].push(line)
                        }

                        // CHECK THAT MESSAGES KEY EXISTS
                        if(!('messages' in jsonObject)){
                            setErrors({
                                ...errors,
                                'messages_key_missing': errors['messages_key_missing'] += 1
                            })
                            errorOccurence['messages_key_missing'].push(line)
                        }

                        if('messages' in jsonObject){
                            jsonObject.messages.forEach((message:{ role: string, content: string}) => {
                                //console.log(message)
    
                                // CHECK THAT ROLE KEY EXISTS
                                if(!('role' in message)){
                                    setErrors({
                                        ...errors,
                                        'role_key_missing': errors['role_key_missing'] += 1
                                    })
                                    errorOccurence['role_key_missing'].push(JSON.stringify(message))
                                }
    
                                // CHECK THAT CONTENT KEY EXISTS
                                if(!('content' in message)){
                                    setErrors({
                                        ...errors,
                                        'content_key_missing': errors['content_key_missing'] += 1
                                    })
                                    errorOccurence['content_key_missing'].push(JSON.stringify(message))
                                }
    
                                // CHECK THAT THERE ARE NO UNRECOGNIZED KEYS
                                const recognizedKeys = ["role", "content", "name", "function_call", "weight"]
                                let keysInDataset = Object.keys(message)
                                const hasRecognizedKeys = keysInDataset.every((element) => recognizedKeys.includes(element))
                                
                                if(!hasRecognizedKeys){
                                    setErrors({
                                        ...errors,
                                        'unrecognized_key': errors['unrecognized_key'] += 1
                                    })
                                    errorOccurence['unrecognized_key'].push(JSON.stringify(message))
                                }
    
                                // CHECK THAT THERE ARE NO UNRECOGNIZED ROLES
                                const recognizedRoles = ["system", "user", "assistant", "function"]
                                if(!(recognizedRoles.includes(message.role))){
                                    setErrors({
                                        ...errors,
                                        'unrecognized_role': errors['unrecognized_role'] += 1
                                    })
                                    errorOccurence['unrecognized_role'].push(JSON.stringify(message))
                                }
    
                                //CHECK THAT CONTENT IS NOT MISSING
                                if(message.content === ''){
                                    setErrors({
                                        ...errors,
                                        'content_is_missing': errors['content_is_missing'] += 1
                                    })
                                    errorOccurence['content_is_missing'].push(JSON.stringify(message))
                                }
    
                                //CHECK THAT CONTENT IS A STRING
                                if(message?.content && typeof message.content !== 'string'){
                                    setErrors({
                                        ...errors,
                                        'content_is_not_a_string': errors['content_is_not_a_string'] += 1
                                    })
                                    errorOccurence['content_is_not_a_string'].push(JSON.stringify(message))
                                }
                            })
                        }

                        //CHECK THAT ASSISTANT MESSAGE EXISTS
                        const hasAssistantMessage = jsonObject.messages.some((item:{ role: string, content: string}) => item.role === 'assistant')
                        if(!hasAssistantMessage){
                            setErrors({
                                ...errors,
                                'missing_assistant_message': errors['missing_assistant_message'] += 1
                            })
                            errorOccurence['missing_assistant_message'].push(line)
                        }
                    }
                })
                setFileName(nameOfFile)
            }
			reader.readAsText(file)
			reader.onloadend = (e) => {
				setIsFileValidated(true)
			}
        }
	}

    console.log(errors)
    console.log(errorOccurence)


    return (
        <div className='max-width m-auto'>
            <Link to='/'><span>Back</span></Link>
            <h1 className='text-center mt-10'>Run Validations on OpenAI Formatted File</h1>
            <div className='mt-8 flex flex-wrap gap-3 items-center'>
                <input className='hidden' accept='.jsonl' onChange={handleUpload} type='file' ref={inputRef} />
                <button onClick={handleInputClick}>Upload File</button>
                <span>{ fileName }</span>
            </div>
            { !isFileValidated && <ChecksToBeDone/> }
            {
                isFileValidated &&
                <div className='mt-10'>
                    <h2 className='mb-5'>Validation Results:</h2>
                    <div className='bg-slate-300 rounded-lg p-4'>
                        {
                            Object.entries(errors).map(([key, value], index) => (
                                <div className='mb-5'>
                                    <div>
                                        <span className='font-semibold'>{ key }: </span>
                                        <span>{ value } { value > 1 ? 'occurences ' : 'occurence '}</span> 
                                        {
                                            value > 0 ? <span className='text-red-500'>&#128473;</span> : <span className='text-emerald-500'>&#10003;</span>
                                        }
                                    </div>
                                    {
                                        errorOccurence[key]?.length > 0 && 
                                        <div className='bg-slate-100 p-4 mt-3 rounded-lg divide-y divide-slate-300'>
                                            {
                                                errorOccurence[key]?.map(item => (
                                                    <p className='py-3 break-all'>{ item }</p>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Validations