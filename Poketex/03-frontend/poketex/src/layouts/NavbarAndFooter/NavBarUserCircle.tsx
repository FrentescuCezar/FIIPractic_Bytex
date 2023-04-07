import React, { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import imageUrl from '../../Images/BooksImages/book-luv2code-1000.png'
import PoketexModel from '../../models/PoketexModel';
import { Link } from 'react-router-dom';

interface UserCircleProps {
    onLogout: () => void;
    username: string;
}


const UserCircle: React.FC<UserCircleProps> = ({ onLogout, username }) => {

    const [profileImage, setProfileImage] = React.useState<string>('');

    async function fetchPoketex() {
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const baseUrl: string = `http://localhost:8084/api/pokedex/random/user?username=frentescucezar@gmail.com&limit=1`;
        const response = await fetch(baseUrl, {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }

        const responseJson = await response.json();


        let responseData;
        responseData = responseJson.content;

        setProfileImage(responseData[0].image);

    }

    const backgroundImageStyle = { backgroundImage: `url(data:image/png;base64,${profileImage})` };


    useEffect(() => {
        fetchPoketex();
    }, []);


    return (
        <Dropdown>
            <div className="circle" style={backgroundImageStyle}>
                <Dropdown.Toggle id="user-circle" className="circle-toggle" />
            </div>
            <Dropdown.Menu align="end">
                <Link to={`/user/${username}/${username}`}>
                    <Dropdown.Item as="span">User Profile</Dropdown.Item>
                </Link>
                <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default UserCircle;