import syled from 'styled-components';

export const WishListContainer = syled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;

    .wishlist-wrapper {
        display: flex;
        flex-direction: column;
        padding: 0rem 20rem;
        gap: .6rem;

        h1 {
            font-weight: 500;
            color: #393939;
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
        display: flex;

        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 12rem;
            height: 12rem;
            box-shadow: 0px 0px 10px 0px #e0e0e0;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
            margin: 0.5rem;
        }

        img {
            object-fit: cover;
            border-radius: 10px;
            height: 100%;
            width: 100%;
        }

        p {
            font-size: 1.2rem;
            color: #393939;
            font-weight: 500;
        }
    }
`;
