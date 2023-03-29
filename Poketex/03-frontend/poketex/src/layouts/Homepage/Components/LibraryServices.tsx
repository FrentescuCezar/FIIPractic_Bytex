export const LibraryServices = () => {
    return (
        <div className='container my-5'>
            <div className='row p-4 align-items-center border shadow-lg'>
                <div className='col-lg-7 p-3'>
                    <h1 className='display-5 fw-bold'>
                        Want to see what happens when AI meets the wonderful world of Pokémon?
                    </h1>
                    <p className='lead'>
                        Who needs an artist when you have a keyboard?
                        Create your own unique Pokémon using just your typing skills and creativity!
                    </p>
                    <div className='d-grid gap-2 justify-content-md-start mb-4 mb-lg-3'>
                        <a className='btn main-color-gray-button btn-lg' href='#'>
                            Sign up
                        </a>
                    </div>
                </div>
                <div className='col-lg-4 offset-lg-1 shadow-lg lost-image'></div>
            </div>
        </div>
    )
}