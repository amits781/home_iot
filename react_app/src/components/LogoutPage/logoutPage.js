import React, { useEffect } from 'react'
import { useLocalStorage } from "../../store/localStore";
import { decryptData } from '../Utils/Utils';

const LogoutPage = () => {
    const { removeItem, getItem } = useLocalStorage();
    const getToken = React.useCallback(() => {
        var token = decryptData(getItem("token"));
        return token ? token : null;
    }, [getItem]);
    useEffect(() => {

        var token = getToken();
        const deAuth = () => {
            removeItem("token");
        }

        if (token !== null) {
            deAuth();
        }
        window.location.href = "/";
        // this.context.router.transitionTo("/erro");

    }, [getToken, removeItem]);
    return (
        <div>logoutPage continue to <a href="/">Sigin</a></div>
    )
}

export default LogoutPage