import styled, { keyframes } from "styled-components";

const fadeInFromDown = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  .user-update-profile-wrapper{
     display: none;

     &.show-update-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;

        .form-upprofile-content {
            animation: ${fadeInFromDown} 0.5s ease;
        }

        .form-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 2rem;
            background-color: #fff;
            box-shadow: 0 .5rem 5rem 5px rgba(0, 0, 0, 0.1);
            border-radius: 1rem;
            position: relative;

            .or {
                color: #7d7d7d;
            }

            .close-icon {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 2rem;
                color: #4c4c4c;
                cursor: pointer;
            }

            h1 {
                font-size: 2rem;
                color: #4c4c4c;
            }

            form {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;

                input {
                    width: 20rem;
                    height: 3rem;
                    padding: 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: .5rem;
                    font-size: 1rem;
                    color: #4c4c4c;
                    transition: all .3s ease;

                    &:focus {
                        border: 2px solid #4c4c4c;
                    }
                }

                button {
                    width: 20rem;
                    height: 3rem;
                    background-color: #4c4c4c;
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 700;
                    border: 2px solid #4c4c4c;
                    border-radius: .5rem;
                    cursor: pointer;
                    transition: all .3s ease;

                    &:hover {
                        background-color: #fff;
                        color: #4c4c4c;
                        border: 2px solid #4c4c4c;
                    }
                }
            }

        }
     }
  }

  .user-profile-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 4rem;
    width: 100%;
    max-width: 90rem;
    background-color: #fff;
    box-shadow: 0 .5rem 5rem 5px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;



    .user-content {
        display: flex;
        flex-direction: column;
        position: relative;

        .add-photo-wrapper {
            width: 9rem;
            height: 4rem;
            position: absolute;
            font-size: 1.3rem;
            top: 12rem;
            left: 5.3rem;
            box-shadow: 0 .5rem 5rem 5px rgba(0, 0, 0, 0.1);
            border-radius: 1rem;
            z-index: 1;
        }

        .email-checked-wrapper {
            display: flex;
            align-items: center;
            gap: .5rem;
            margin-top: 1rem;
            color: #66bb6a;
            font-size: 1rem;
            font-weight: bold;
        }

        .active-green-dot {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: .3rem;
            color: #ffffff;
            width: 3rem;
            height: 3rem;
            background-color: #444444;
            border-radius: 50%;
            margin-right: 1rem;
            position: absolute;
            top: 0rem;
            left: 1.2rem;
            box-shadow: 0 .5rem 5rem 5px rgba(0, 0, 0, 0.1);
        }

        .user-avatar-img {
            border: 3px solid #b19899;
            width: 13rem;
            height: 13rem;
            border-radius: 50%;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .edit-logout-wrapper {
            margin-top: 1rem;
            a {
                color: #838a96;
                font-size: 1rem;
            }
        }


        .logout-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: .9rem;
            margin-top: 5rem;
            background-color: #fff;
            color: #4c4c4c;
            padding: .8rem 2rem;
            font-size: 1rem;
            border: 3px solid #4c4c4c;
            transition: all .3s ease;
            border-radius: .6rem;
            cursor: pointer;

            &:hover {
               background-color: #4c4c4c;
                color: #fff;
                border: 3px solid #4c4c4c;
            }

        }
     }

     .user-desc {
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
        gap: .2rem;
        margin-top: 1rem;

        p {
            font-size: 1.5rem;
            font-weight: 300;
            color: #878787;
        }

        span {
            font-size: .9rem;
            color: #343737;
            font-weight: bold;
        }
     }

     .activities-wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        padding: 1rem;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
        gap: 1rem;

        .acti span:first-child {
            font-size: 1.2rem;
            font-weight: 600;
            color: #535353;
        }

        .acti span:last-child {
            font-size: .8rem;
            color: #838a96;
            margin-top: .3rem;
        }

        div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
     }

     .user-profile-right {
        width: 100%;
        max-width: 60rem;
        margin-left: 2rem;


        .img-profile-wrapper {
            width: 100%;
            height: 15rem;
            overflow: hidden;
            border-radius: 1rem;
            position: relative;

            p {
                position: absolute;
                bottom: 3.8rem;
                left: 0;
                width: 100%;
                padding: 1rem;

                color: #ffffff;
                font-size: 4rem;
                font-weight: 800;
                text-align: center;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;

            }
        }

        .user-more {
            display: flex;
            gap: 2rem;
            .collection-places-wrapper {
              .places-collection {
                width: 38rem;
                height: 10rem;
                margin-top: 2rem;
                box-shadow: 0 .5rem 5rem 5px rgba(0, 0, 0, 0.1);
                border-radius: 1rem;
                padding: 1rem;
                overflow: hidden;

                p {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    color: #7d7d7d;
                }

                .places-collection-wrapper {
                    display: flex;
                    gap: 1rem;

                    .places-collection-cont {
                        width: 5.5rem;
                        height: 5.5rem;
                        overflow: hidden;
                        border-radius: 50%;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                 }

            }

                .favorites-places {
                  width: 38rem;
                  height: 14rem;
                  margin-top: 2rem;
                  box-shadow: 0 .5rem 5rem 5px rgba(0, 0, 0, .1);
                  border-radius: 1rem;
                  padding: 1rem;

                  .favorite-places-wrapper
                  {
                    display: flex;
                    align-items: center;
                    gap: 1rem;

                    .desc {
                        display: flex;
                        flex-direction: column;
                        width: 18rem;

                        button {
                            margin-top: 1rem;
                            width:7rem;
                            background-color: #4c4c4c;
                            color: #fff;
                            font-size: .8rem;
                            font-weight: 700;
                            border: 2px solid #4c4c4c;
                            border-radius: .5rem;
                            cursor: pointer;
                            transition: all .3s ease;

                            &:hover {
                                background-color: #fff;
                                color: #4c4c4c;
                                border: 2px solid #4c4c4c;
                            }

                        }
                    }
                     .desc a {
                        text-decoration: none;
                        color: #2a2a2a;
                        font-size: 1.2rem;
                        font-weight: 700;
                     }
                  }

                   p {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    color: #7d7d7d;
                   }

                   .favorites-places-cont {
                    width: 9rem;
                    height: 9rem;
                    overflow: hidden;
                    border-radius: 50%;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;

                 }
                }
            }

        }
        .user-bio {
            width: 20rem;
            height: auto;
            padding: 2rem;
            margin-top: 2rem;
            background-color: #fff;
            box-shadow: 0 .5rem 5rem 5px rgba(0, 0, 0, 0.1);
            border-radius: 1rem;

            h2 {
                font-size: .9rem;
                margin-bottom: .3rem;
                color: #b6b6b6;
            }

            p {
                font-size: .8rem;
                color: #707070;
            }

            .website {
                margin-top: 1rem;
            }

            .achievement-wrapper {
                display: flex;
                margin-top: 1rem;
                flex-direction: column;

                .achievement-cont {
                    display: flex;
                    gap: .5rem;

                    .achievement-wrapper {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: .3rem;

                        .achievement-icon {
                            color: #4c4c4c;
                            cursor: pointer;
                        }

                    span {
                        font-size: .7rem;
                        color: #7d7d7d;
                        font-weight: bold;
                    }
                }
            }
        }

        .local-time {
            margin-top: 2rem;
            font-size: 2rem;
            color: #7d7d7d;
        }

        .user-social {
            margin-top: .2rem;

            .social-wrapper {
                display: flex;
                gap: 1rem;

                .social-cont {
                    width: 3rem;
                    height: 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #4c4c4c;
                    color: #fff;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all .3s ease;
                    box-shadow: 0 .5rem 1rem 10px rgba(0, 0, 0, 0.1);

                    &:hover {
                        background-color: #ff8c91;
                        color: #fff;
                    }
                }
            }
        }
     }
  }
}
}
`;
