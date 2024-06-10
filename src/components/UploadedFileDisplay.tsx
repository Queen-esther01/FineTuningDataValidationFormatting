import { ChangeEvent, useEffect, useState } from 'react'

const UploadedFileDisplay = ({ dataKeys, isDataError, getDropdownOptions, fileData, setFileData }:FileDisplay) => {
    
    const [dropdownOptions, setDropdownOptions] = useState({
		user: '',
		assistant: ''
	})

    const handleDropdownSelect = (e:ChangeEvent<HTMLSelectElement>) => {
		setDropdownOptions({
			...dropdownOptions,
			[e.target.name]: e.target.value
		})
		getDropdownOptions({
			...dropdownOptions,
			[e.target.name]: e.target.value
		})
	}

    useEffect(() => {
        if(fileData){
            localStorage.setItem('file', fileData)
        }
    }, [fileData])
    
    return (
        <div className='w-full lg:w-1/2 mt-12'>
            {
                <div className='flex flex-wrap gap-3'>
                    <div className='flex flex-col'>
                        <label className='font-semibold mb-2'>Add To User</label>
                        <select onChange={handleDropdownSelect} name='user' className=''>
                            <option value=''>Select an option</option>
                            {
                                dataKeys?.map((value:string) => (
                                    <option>{ value }</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-semibold mb-2'>Add To Assistant</label>
                        <select onChange={handleDropdownSelect} name='assistant' className=''>
                            <option value=''>Select an option</option>
                            {
                                dataKeys?.map((value:string) => (
                                    <option>{ value }</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            }
            { isDataError && <p className='mt-5 text-red-500'>SyntaxError: Unexpected token</p>}
            <textarea value={fileData} onChange={(e) => setFileData(e.target.value)}  rows={20} className={`${isDataError ? 'border-red-600 focus:outline-red-600 border-2' : ''} mt-5 w-full h-full`}/>
        </div>
    )
}

interface FileDisplay {
    dataKeys: string[]
    getDropdownOptions: (data:{ user: string, assistant: string}) => void
    fileData: string
    isDataError: boolean
    setFileData: (e:string) => void
}

export default UploadedFileDisplay