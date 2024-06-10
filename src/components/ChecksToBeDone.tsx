

const ChecksToBeDone = () => {
    return (
        <div className='mt-10'>
            <h2 className='mb-5'>Checks that will be run: </h2>
            <div className='bg-slate-300 rounded-lg p-4'>
                <ol className='list-decimal list-inside'>
                    <li>Check that file is valid json</li>
                    <li>Check that each line is a valid object</li>
                    <li>Check that messages key is not missing</li>
                    <li>Check that roles key is not missing</li>
                    <li>Check that content key is not missing</li>
                    <li>Check that there is no unrecognized key (recognized keys are role & content)</li>
                    <li>Check that there is no unrecognized role (recognized roles are system, user & assistant)</li>
                    <li>Check that content is not missing</li>
                    <li>Check that content is a string</li>
                    <li>Check that assistant object is not missing</li>
                </ol>
            </div>
        </div>
    )
}

export default ChecksToBeDone