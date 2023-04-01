export const Footer = () => {
    return (
        <div className="main-color-gray">
            <div className="flex-grow-1">
                {/* page content */}
            </div>
            <footer className="footer mt-auto py-5">
                <div className="container d-flex flex-wrap justify-content-between align-items-center main-color-gray">
                    <p className="col-md-4 mb-0 text-black">@ Poketex, Frentescu Cezar-Augustin</p>
                    <ul className="nav navbar-dark  col-md-4 justify-content-end">
                        <li className="nav-item">
                            <a href="https://github.com/FrentescuCezar" target="_blank" className="nav-link px-2 text-black">
                                Github
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="https://www.linkedin.com/in/frentescu-cezar" target="_blank" className="nav-link px-2 text-black">
                                Linkedin
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};