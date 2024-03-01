import styled, { keyframes } from "styled-components";

const guestsTinyBoxJump = keyframes`
   0% {
      transform: translateY(-10px);
    }
    50% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0);
    }
`;

const growWrapperIcon = keyframes`
  from {
    width: 3.6rem;
  }
  to {
    width: 7rem;
  }
`;

export const AddGuestsContainer = styled.div`
    width: 22rem;
    height: 100%;
    background-color: #fff;
    color: #2a2a2a;
    display: flex;
    align-items: center;
    border-radius: 3rem;

    .add-guests-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      &:hover {
        background-color: #dbdbdb;
        border-radius: 3rem;
        height: 100%;
        cursor: pointer;
      }

      .header-guests {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #424242;
        color: #fff;
        border-radius: 3rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);

        p {
          margin-left: 1.6rem;
        }

        p:first-child {
        font-size: 0.9rem;
      }

        p:last-child {
          color: #909090;
          font-size: 1rem;

        }
      }

      .header-guests-two {

        p {
          margin-left: 1.6rem;
        }

        p:first-child {
        font-size: 0.9rem;
      }

        p:last-child {
          color: #909090;
          font-size: 1rem;

        }
        }

      }

      .guests-tiny-box {
        display: flex;
        flex-direction: column;
        background-color: #424242;
        color: #fff;
        height: auto;
        position: absolute;
        top: 5.2rem;
        left: 17.6rem;
        padding: 1rem 1.5rem;
        border-radius: 1rem;
        z-index: 1000;
        animation: ${guestsTinyBoxJump} 0.3s ease-in-out;

        div {
          margin-bottom: .3rem;
        }

        .adult-wrapper {
          display: flex;
        }

        .child-wrapper {
          display: flex;

          * {
            margin-right: 0.3rem;
          }
        }
        .infant-wrapper {
          display: flex;

          * {
            margin-right: 0.3rem;
          }
        }
        .pet-wrapper {
          display: flex;

          * {
            margin-right: 0.3rem;
          }
        }

        span {
          margin-left: 0.1rem;
          font-size: 1.2rem;
        }
      }

      .guests-dropdown {
        width: 27rem;
        height: auto;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 5rem;
        right: 0rem;
        background-color: #fff;
        border-radius: 1.5rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        padding: 1.5rem 3rem 0rem 2rem;
        display: none;
        z-index: 1000;

        &.show {
          display: block;
        }

        p {
          font-size: 1.2rem;
        }

        .section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 1.5rem;

          .counter {
            display: flex;
            align-items: center;

            span {
              margin: 0 1rem;
              font-size: 1.2rem;
              color: #909090;
            }

            .counter-icon {
              font-size: 1.5rem;
              color: #909090;
              cursor: pointer;
            }

            .counter-icon.disabled {
              color: #e0e0e0;
              cursor: not-allowed;

              &:hover {
                color: #909090;
                cursor: not-allowed;
              }
            }
          }

          .guest {
            p {
              font-size: 1.2rem;
              padding-bottom: 0.5rem;
            }

            span, a {
              color: #909090;
              font-size: 1rem;
            }
          }
        }
      }

      .search-guests-wrapper {
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      background-color: #0baa4e;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: .8rem;
      transition: all 0.3s;
      position: absolute;
      right: 0;


      p {
        display: none;
      }

      .search-icon {
        font-size: 1.3rem;
        color: #fff;
      }

      .bg-icon-color {
        background-color: #0a8d3d;
      }
      .search-wrapper-ready {
        width: 7rem;
        background-color: #0baa4e;
        border-radius: 3rem;
        animation: ${growWrapperIcon} 0.5s;

        p {
          display: block;
          margin-left: .5rem;
          font-size: 1rem;
          color: #fff;
        }
      }
    }
`;
