import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

import { UserContext } from '../src/providers/UserProvider';
import { PlacesContext } from '../src/providers/PlacesProvider';
import { NotificationsContext } from '../src/providers/NotificationsProvider';
import axiosInstance from '../src/utils/axios';

import { setItemsInLocalStorage, getItemsFromLocalStorage, removeItemFromLocalStorage} from '../src/utils';

// User context
export const useAuth = () => {
    return useContext(UserContext)
}

export const useProvideAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = getItemsFromLocalStorage('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false)
    }, [])

    const getAllUsers = async () => {
        try {
            const { res } = await axiosInstance.get('/users') as any
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    const register = async (formData: any) => {
        const { name, email, password } = formData;

        try {
            const { data } = await axiosInstance.post('/register', {
                name,
                email,
                password,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Registration successfull' }
        } catch (error: any) {
            const { message } = error.response.data
            return { success: false, message }
        }
    }

    const login = async (formData: any) => {
        const { email, password } = formData;

        try {
            const { data } = await axiosInstance.post('/login', {
                email,
                password,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Login successfull' }
        } catch (error: any) {
            const { message } = error.response.data
            return { success: false, message }
        }
    }

    const googleLogin = async (credential: any) => {
        const decoded = jwtDecode(credential) as any;
        try {
            const { data } = await axiosInstance.post('/google/login', {
                name: `${decoded.given_name} ${decoded.family_name}`,
                email: decoded.email,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Login successfull' }
        } catch (error: any) {
            return { success: false, message: error.message }
        }
    }

    const logout = async () => {
        try {
            const { data } = await axiosInstance.get('/logout');
            if (data.success) {
                setUser(null);

                // Clear user data and token from localStorage when logging out
                removeItemFromLocalStorage('user');
                removeItemFromLocalStorage('token');
            }
            return { success: true, message: 'Logout successfull' }
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Something went wrong!' }
        }
    }

    const uploadPicture = async (avatar: any) => {
        try {
            const formData = new FormData()
            formData.append('avatar', avatar)
            const { data } = await axiosInstance.post('/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const updateUser = async (userDetails: any) => {
        const { name, password, avatar } = userDetails;
        const email = JSON.parse(getItemsFromLocalStorage('user') as any).email;
        try {
            const { data } = await axiosInstance.put('/update-user', {
                name, password, email, avatar
            })
            return data;
        } catch (error) {
            console.log(error)
        }
    }


    return {
        user,
        setUser,
        getAllUsers,
        register,
        login,
        googleLogin,
        logout,
        loading,
        uploadPicture,
        updateUser
    }
}

interface Place {
    owner: number;
    title: string;
    address: string;
    photos: string[];
    description: string;
    perks: string[];
    extraInfo: string;
    maxGuests: number;
    price: number;
}

// The Places Provider
export const usePlaces = () => {
    return useContext(PlacesContext)
}

export const useProvidePlaces = () => {
    const [places, setPlaces] = useState<Place[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getPlaces = async () => {
        const { data } = await axiosInstance.get('/')
        setPlaces(data)
        setLoading(false)
    }

    useEffect(() => {
        getPlaces()
    } , [])

    return {
        places,
        setPlaces,
        loading,
        setLoading,
    }
}

// The Notifications Provider
export const useNotifications = () => {
    return useContext(NotificationsContext)
}

export const useProvideNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const getNotifications = async () => {
        const { data } = await axiosInstance.get('/notifications')
        console.log(data)
        setNotifications(data)
        setLoading(false)
    }

    useEffect(() => {
        getNotifications()
    } , [])

    return {
        notifications,
        setNotifications,
        loading,
        setLoading,
    }
}
