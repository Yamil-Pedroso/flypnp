/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

import { UserContext } from '../src/providers/UserProvider';
import { PlacesContext } from '../src/providers/PlacesProvider';
import { NotificationsContext } from '../src/providers/NotificationsProvider';
import { WishlistContext } from '../src/providers/WishlistProvider';
import { BookingContext } from '../src/providers/BookingProvider';
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

interface Photo {
    main: string;
    thumbnails: string[];

}

interface Place {
    _id: string;
    title: string;
    address: string;
    photos: Photo[];
    category: string;
    description: string;
    perks: string[];
    extraInfo: string;
    maxGuests: number;
    rating: number;
    reviews: number;
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
        try {
        const { data } = await axiosInstance.get('/all-places')
        setPlaces(data.data)
        setLoading(false)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
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

    const getNotifications = async (userId: any) => {

        try  {
        const { data } = await axiosInstance.get(`/notification/${userId}`)
        setNotifications(data)
        setLoading(false)
    }   catch (error) {
        console.log(error)
    }
    }

    const deleteNotification = async (notisId: any) => {
        try {
        const { data } = await axiosInstance.delete(`/delete-notification/${notisId}`)

        if (data.success) {
            const newNotis = notifications.filter((notis: any) => notis._id !== notisId)
            setNotifications(newNotis)
        }

    }  catch (error) {
        console.log(error)
    }
    }

    useEffect(() => {
        const user = JSON.parse(getItemsFromLocalStorage('user') as any)
        if (user) {
            getNotifications(user._id)
        }
    } , [])

    return {
        notifications,
        deleteNotification,
        setNotifications,
        loading,
        setLoading,
    }
}

// The Wishlist Provider
interface Wishlist {
    id: string;
    placeId: string;
    place: string;
    title: string;
    picture: string;
}

export const useWishlist = () => {
    return useContext(WishlistContext)
}

export const useProvideWishlist = () => {
    const [wishlist, setWishlist] = useState<Wishlist[]>([])
    const [loading, setLoading] = useState(true)

    const addWishlist = async (placeId: any, title: any, picture: any) => {
        try {
        //const user = JSON.parse(getItemsFromLocalStorage('user') as any)
        const token = getItemsFromLocalStorage('token')

        if (!token) {
            console.log('User not authenticated or token expired')
        }
        const { data } = await axiosInstance.post('/add-place', {
            placeId,
            title,
            picture,

        },{
            headers: {
                Authorization: `Bearer ${token}`
            }

        })
        console.log(data.data)
        setWishlist(data.data)
    }  catch (error) {
        console.log(error)
    }
    }

    const getWishlist = async (  ) => {
        try {
          const { data } = await axiosInstance.get('/user-wishlist')
            setWishlist(data.data)
    }  catch (error) {
        console.log(error)
    }
    }

    const deleteWishlist = async (placeId: any) => {
        try {
        const { data } = await axiosInstance.delete(`/remove-place/${placeId}`)

        if (data.success) {
            const newWishlist = wishlist.filter((wish: any) => wish.place !== placeId)
            setWishlist(newWishlist)
        }

    }  catch (error) {
        console.log(error)
    }
    }

    useEffect(() => {
        const user = JSON.parse(getItemsFromLocalStorage('user') as any)
        if (user) {
            getWishlist()
        }
    } , [])

    return {
        wishlist,
        getWishlist,
        addWishlist,
        deleteWishlist,
        loading,
        setLoading,
    }
}

// The Booking Provider

interface Booking {
    owner: string
    place: string
    checkIn: Date
    checkOut: Date
    numOfGuests: {
        adults: number
        children: number
        infants: number
        pets: number
    }
    extraInfo: string
    status: string
    name: string
    phone: string
    price: number
}
export const useBooking = () => {
    return useContext(BookingContext)
}

export const useProvideBooking = () => {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)

    const addBooking = async (booking: Booking) => {
        try {
        const { data } = await axiosInstance.post('/create-booking', booking)
        setBookings(prevBookings => [...prevBookings, data.data])
        console.log(data.data)
    }  catch (error) {
        console.log(error)
    }
    }

    const getBookings = async () => {
        try {
          const { data } = await axiosInstance.get('/user-bookings')
            setBookings(data.data)
    }  catch (error) {
        console.log(error)
    }
    }

    const getBookingDetails = async (id: any) => {
        try {
        const { data } = await axiosInstance.get(`/booking-details/${id}`)
        return data.data
    }  catch (error) {
        console.log(error)
    }
    }

    const updateBooking = async (id: string, booking: Partial<Booking>) => {
        try {
            const { data } = await axiosInstance.put(`/update-booking/${id}`, booking);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteBooking = async (id: any) => {
        try {
        const { data } = await axiosInstance.delete(`/delete-booking/${id}`)

        if (data.success) {
            const newBookings = bookings.filter((booking: any) => booking._id !== id)
            setBookings(newBookings)
        }

    }  catch (error) {
        console.log(error)
    }
    }

    useEffect(() => {
        const user = JSON.parse(getItemsFromLocalStorage('user') as any)
        if (user) {
            getBookings()
        }
    } , [])

    return {
        bookings,
        getBookings,
        addBooking,
        deleteBooking,
        getBookingDetails,
        updateBooking,
        loading,
        setLoading,
    }
}
