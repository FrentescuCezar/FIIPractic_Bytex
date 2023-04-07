import React, { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import usernamePhoto from '../../Images/PublicImages/usernamePhoto.png'

interface UserCircleProps {
    onLogout: () => void;
    username: string;
    authState: any;
}


const UserCircle: React.FC<UserCircleProps> = ({ onLogout, username, authState }) => {

    const [profileImage, setProfileImage] = React.useState<string>('');
    const [responseDataLength, setResponseDataLength] = React.useState<number>(0);

    async function fetchPoketex() {
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const baseUrl: string = `http://localhost:8084/api/poketex/user/random?username=${username}&limit=1`;
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
        if (responseData.length !== 0) {
            setProfileImage(responseData[0].image);
            setResponseDataLength(responseData.length);
        } else {
            setProfileImage(usernamePhoto);
            setResponseDataLength(responseData.length);
        }

    }

    let backgroundImageStyle;
    if (responseDataLength !== 0) {
        backgroundImageStyle = { backgroundImage: `url(data:image/png;base64,${profileImage})` };
    } else {
        backgroundImageStyle = { backgroundImage: `url(${profileImage})` };
    }


    useEffect(() => {
        fetchPoketex();
    }, [authState?.isAuthenticated]);


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