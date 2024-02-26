import syled from 'styled-components';

export const WishListContainer = syled.div`
  display: flex;
    flex-direction: column;
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
    position: relative;



    .wishlist-wrapper {
        display: flex;
        flex-direction: column;
        padding: 1rem 20rem;
        gap: .6rem;

        .empty-box-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            border-radius: 0.625rem;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        h1 {
            font-weight: 500;
            color: #666666;
        }

        p {
            font-size: 1.1rem;
            color: #8d8d8d;
            font-weight: 100;
            width: 50%;
            line-height: 1.4rem;
            margin-top: .3rem;
        }

    }

    .wishlist-content-wrapper {
        width: 80rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;

        .content-wrapper {
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .content {
            width: 15rem;
            height: 15rem;
            box-shadow: 0px 0px 10px 0px #e0e0e0;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
            margin: 0.5rem;
            padding: 0.5rem;
        }

        img {
            object-fit: cover;
            border-radius: 10px;
            height: 100%;
            width: 100%;
        }

        .text-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 1rem;
            width: 2rem;
            height: 2rem;
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0px 0px 5rem .2px #707070;
            position: absolute;
            opacity: 0;
            right: 0;
            top: -1rem;
            transition: all 0.2s ease;

            &.show {
                opacity: 1;
            }
        }
    }

    .delete-box-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        width: 22rem;
        height: 20rem;
        background-color: #fff;
        border-radius: 0.625rem;
        box-shadow: 0px 0px 2rem 1px rgba(0, 0, 0, 0.2);
        position: absolute;
        top: 50%;
        left: 50%;
        display: none;
        transform: translate(-50%, -50%);
        z-index: 100;

        &.show {
            display: block;
        }

        &.close {
            display: none;
        }

        .btn-box-wrapper {
            display: flex;
            gap: 1rem;
        }

        h3 {
            font-size: 1.2rem;
            color: #666666;
        }

        .delete-btn {
            padding: .5rem 1rem;
            background-color: #2a2a2a;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background-color: #ff1a1a;
            }
        }

        .cancel-btn {
            padding: .5rem 1rem;
            background-color: #e0e0e0;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background-color: #b3b3b3;
            }
        }
    }

`;
