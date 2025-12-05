import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/Navbar/Navbar';
import Footer from '../../shared/Footer/Footer';

const Main = () => {
    return (
        <>  
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    );
};

export default Main;