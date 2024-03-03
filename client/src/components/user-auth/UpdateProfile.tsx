/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useAuth } from '../../../hooks/index'
import { IoCloseSharp } from 'react-icons/io5'

interface UpdateProfileProps {
  closeUserForm: () => void
}

const UpdateProfile = ({ closeUserForm }: UpdateProfileProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    password: '',
  })
  const [formErrors, setFormErrors] = React.useState({
    name: false,
    password: false,
  })
  const auth = useAuth() as any
  const { user, updateUser } = auth

  const handleFormData = (e: any) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: false,
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const submitData = new FormData()
    if (formData.name) submitData.append('name', formData.name)
    if (formData.password) submitData.append('password', formData.password)

    const response = await updateUser(formData, user._id)
    if (response.success) {
      console.log('User updated')
      user.setUser(response.user)
    } else {
      console.log('Update failed')
    }
  }

  const handleCloseForm = () => {
    closeUserForm()
  }

  return (
    <div className="user-upprofile-form-container">
      <div className="form-wrapper">
        <h1>Update Profile</h1>
        <IoCloseSharp onClick={handleCloseForm} className="close-icon" />
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleFormData}
            placeholder="Edit name"
          />
          <div className="or">
            <h3>or 🙃</h3>
          </div>
          <input
            name="password"
            type="password"
            placeholder="Edit password"
            value={formData.password}
            onChange={handleFormData}
            className={formErrors.password ? 'error-border' : ''}
          />
          <button
            onClick={() => {
              closeUserForm()
            }}
          >
            Close
          </button>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile
