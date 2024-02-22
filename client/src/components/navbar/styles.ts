import styled, { keyframes } from 'styled-components';

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

export const NavbarContainer = styled.div`
 .navbar-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 3rem;
    background-color: #fff;
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 600;
    color: #000;

    p {
      margin-left: .3rem;
      color: #f94a52;;
    }
  }

  .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
      display: none;
    }

  img {
    width: 5rem;
  }

  .nav-menu-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

      li.active {
        margin: 0 15px;
        font-size: 1.1rem;
        font-weight: 500;
        color: #000;
        list-style: none;
        cursor: pointer;
      }

      li {
        margin: 0 15px;
        font-size: 1.1rem;
        font-weight: 500;
        color: #686868;
        list-style: none;
        cursor: pointer;

      }

    }
    .user-menu-container {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .user-login-form-wrapper {
        display: flex;
        position: absolute;
        width: 100%;
        height: 1000vh;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        display: none;
        z-index: 1;
        transition: all 0.3s ease-in-out;

        &.show-login {
          display: block;
        }

        .form-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 10%;
          animation: ${fadeInFromDown} .6s ease-in-out;
        }

      }
      .user-register-form-wrapper {
        display: flex;
        position: absolute;
        width: 100%;
        height: 1000vh;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        display: none;
        z-index: 1;
        transition: all 0.3s ease-in-out;

        &.show-register {
          display: block;
        }

        .form-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 10%;
          animation: ${fadeInFromDown} .6s ease-in-out;
        }

      }

      .user-menu-item .world-icon {
        font-size: 1.5rem;
        margin-right: 1.2rem;
        margin-top: .9rem;
        color: #686868;
      }


        .menu-translation-region-wrapper {
          display: flex;
          position: absolute;
          width: 100%;
          height: 1000vh;
          background-color: rgba(0, 0, 0, 0.5);
          top: 0;
          left: 0;
          display: none;
          z-index: 1;
          transition: all 0.3s ease-in-out;

           &.show {
              display: block;
           }

           .menu-translation-region-content {
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              top: 12rem;
              left: 22.5%;
              margin: 0 auto;
              width: 60rem;
              height: 40rem;
              background-color: #fff;
              border-radius: 1rem;

              h2 {
                font-size:1%.8rem;
                font-weight: 600;
                color: #000;
                margin: 1.5rem 0 0 2rem;
              }

              animation: ${fadeInFromDown} .6s ease-in-out;
              .close-icon-wrapper .close-icon-translate {
                   position: absolute;
                   top: 1rem;
                   right: 1rem;
                   font-size: 1.5rem;
                   cursor: pointer;
               }
           }


        }

        .user-menu-content {
          position: relative;
        }

        .user-menu-content .user-menu-box {
            width: 18rem;
            height: auto;
            background-color: #fff;
            position: absolute;
            top: 3.5rem;
            right: 0rem;
            border-radius: .6rem;
            box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            opacity: 0;

            &.show {
                opacity: 1;
                z-index: 1;
            }

            .user-menu-box-content {
              ul {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                  cursor: pointer;
                  font-weight: 500;

                  a {
                    color: #686868;
                    text-decoration: none;
                    font-size: 1.1rem;
                    padding: 1rem 1.5rem;
                    display: block;
                    transition: all 0.3s ease-in-out;

                    &:hover {
                      background-color: #f94a52;
                      color: #fff;
                    }
                  }
                }
              }
            }
        }
    }

    .user-menu-wrapper {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 7rem;
     height:3rem;
     border-radius: 5rem;
     box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.3);

      > div {
         margin: 0 8px;
      }

       .user-menu-item .menu-lines {
           font-size: 1.5rem;
       }

       .user-menu-item .user-avatar {
           width: 2.5rem;
           height: 2.5rem;
           border-radius: 50%;
       }

       .user-menu-item .user-icon {
           font-size: 1.9rem;
           color: #686868;
       }

       .notification-count {
           position: absolute;
           top: -5px;
           right: 10px;
           width: 1.3rem;
           height: 1.3rem;
           background-color: #09aa4e;
           color: #fff;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 1rem;
       }

       .notification-count p {
           font-size: .8rem;
       }
   }
`;
