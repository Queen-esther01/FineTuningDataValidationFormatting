import React, { ChangeEvent } from 'react'
import { downloadFile } from '../helpers/downloadFile'

const FormattedDataDisplay = ({ isLoadingJson, openAIData, setOpenAIData, fileName }:FormattedData) => {
    return (
        <div className='lg:w-1/2 mt-12'>
            { isLoadingJson && <span>File is loading....</span>}
            <div className='flex items-center justify-between '>
                <h2>OpenAI Formatted Data</h2>
                <button onClick={() => downloadFile(openAIData, fileName)} disabled={!openAIData} className={`${!openAIData && 'bg-slate-200 text-slate-700 font-semibold'}`}>Download JSON</button>
            </div>
            <p className='mt-5'>Only make changes here when you are ready to export. </p>
            <textarea onChange={(e) => setOpenAIData(e.target.value)} value={openAIData} className='mt-5  w-full h-full'/>
        </div>
    )
}

interface FormattedData {
    openAIData: string
    isLoadingJson: boolean
    fileName: string
    setOpenAIData: (e:string) => void
}

export default FormattedDataDisplay