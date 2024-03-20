import styled, { keyframes } from 'styled-components';

const rebound = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.80);
  }
  100% {
    transform: scale(1);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
  max-width: 70rem;
  margin: 0 auto;


  .header-details-wrapper {
    width: 69rem;
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
  }

  .share-save-wrapper {
    display: flex;

    div {
      display: flex;
      align-items: center;
      margin-right: 1rem;
      cursor: pointer;

      span {
        margin-left: .5rem;
        text-decoration: underline;
      }
    }
  }

  .img-details-wrapper {
    width: 69rem;
    height: 36.5rem;
    display: flex;
    border-radius: .7rem;
    overflow: hidden;

    .img-wrapper {
      width: 35rem;
      height: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .img-thumbnail-wrapper {
      width: 35rem;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: .3rem;
      position: relative;

      img {
        width: 17rem;
        height: 18.2rem;
        object-fit: cover;
      }
    }
  }

  .desc-reserve-wrapper {
    width: 69rem;
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;

    .place-desc-wrapper {
      .superhost-wrapper {
        display: flex;
        align-items: center;
        margin-top: 2.5rem;
        gap: 1.8rem;
        position: relative;
        .award-icon {
          color: #f1356d;
          position: absolute;
          top: 2rem;
          left: 3rem;
        }
        .superhost-avatar {
          display: flex;
          align-items: center;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 4rem;
            height: 4rem;
            object-fit: cover;
          }
        }
        .superhost-desc {
          display: flex;
          flex-direction: column;
          gap: .2rem;

          p:nth-child(1) {
            font-size: 1.2rem;
            font-weight: 500;
          }
          p:nth-child(2) {
            font-size: 1rem;
            font-weight: 100;
            color: #575757;
          }
        }
    }

    .horizontal-line {
      width: 40rem;
      height: 1px;
      background-color: #cacaca;
      margin-top: 2rem;
    }

    .desc-place-wrapper {
      display: flex;
      flex-direction: column;
      width: 40rem;
      gap: 1rem;
      margin-top: 2.5rem;

      .desc-1, .desc-2, .desc-3, .desc-4 {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-top: 1rem;

        h3 {
          font-size: 1.2rem;
          font-weight: 500;
        }

        p {
          font-size: 1rem;
          font-weight: 500;
          margin-top: .3rem;
          color: #989898;
        }
      }


    }


   }

    .place-desc-wrapper p:nth-child(1) {
      font-size: 1.6rem;
      font-weight: 500;
    }

    .place-desc-wrapper p:nth-child(2) {
      font-size: 1.1rem;
      color: #575757;
      font-weight: 100;
    }

    .fav-guest-wrapper {
      display: flex;
      align-items: center;
      margin-top: 2.5rem;
      border: 1px solid #cacaca;
      border-radius: .5rem;
      padding: 1.5rem 1.5rem;
      width: 40rem;

      .fav-guest-cont {
        display: flex;

        .oliven-cont {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30%;

          .oliven-2 {
            transform: rotate(90deg);
          }
        }
      }

      .fav-guest-cont .oliven-cont p {
        font-size: 1.4rem;
        font-weight: 500;
        margin-left: .6rem;
        color: #000000;
      }

      .fav-guest-cont .p-2 {
        font-size: 1rem;
        font-weight: 800;
        color: #181818;
        margin-left: 3rem;
        margin-top: .5rem;
        width: 15rem;
      }

      .rating-review-wrapper {
        display: flex;
        align-items: center;
        gap: .5rem;
        margin-top: .5rem;

        p:nth-child(1) {
          font-size: 1.1rem;
          font-weight: 600;
          color: #181818;
        }

        p:nth-child(2) {
          font-size: 1.1rem;
          color: #181818;
          font-weight: 600;
          margin-left: .3rem;

            span {
              font-weight: 100;
              color: #f1356d;
              text-decoration: underline;
              cursor: pointer;
            }
        }
      }
    }

    .reserve-box-container {
        width: 23rem;
        height: 28rem;
        padding: 1rem;
        border-radius: .5rem;
        border: 1px solid #dddddd;
        box-shadow: 0 1rem 2rem 1px rgba(0, 0, 0, 0.1);
        position: relative;

        .guests-dropdown {
           width: 27rem;
           height: auto;
           display: flex;
           flex-direction: column;
           position: absolute;
           top: 15rem;
           right: 0rem;
           background-color: #fff;
           border-radius: .5rem;
           box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
           padding: 1.5rem 3rem 0rem 2rem;
           z-index: 1000;

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

        .calendar {
           display: flex;
           justify-content: center;
           width: 55rem;
           height: 36rem;
           border-radius: 1rem;
           top: 10rem;
           right: -2rem;
           background-color: #fff;
           box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
           position: absolute;
           overflow: hidden;

           .calendar-wrapper{
              margin-bottom: 4rem;
           }
         }

        .check-in-out-guests-wrapper {
           margin-top: 1rem;
           border: 1px solid #cacaca;
            border-radius: .5rem;
            padding: 1rem;

            .horizontal-line {
              width: 100%;
              height: 1px;
              background-color: #9d9d9d;
              margin-top: 1rem;
            }
           .check-in-out-guests-box {
             display: flex;
             justify-content: space-between;


              button {
                background-color: #2a2a2a;
                padding: .5rem 2rem;
              }

             .vertical-line {
                width: 1px;
                background-color: #9d9d9d;
              }
           }
        }

        .guests-box {
          margin-top: 1rem;
          .dropdown-guests-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .arrow-down-up {
              span {
                font-size: 1.2rem;
                cursor: pointer;
              }

            }
          }
        }
    }

    .reserve-box-container button {
        padding: 0.5rem 1rem;
        margin: 1rem 0;
        border: none;
        border-radius: 5px;
        background-color: #f1356d;
        color: white;
        cursor: pointer;
        transition: 0.3s;

        &:hover {
            background-color: #f1356d;
            opacity: 0.8;
        }
    }
  }

  .show-all-photos-container {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    padding: .5rem 1rem;
    border-radius: .8rem;
    font-size: .8rem;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border: 1px solid #2a2a2a;

    &.reboundBtn {
      animation: ${rebound} .2s ease;
    }

    p {
      margin-left: .5rem;
    }
  }
`;
