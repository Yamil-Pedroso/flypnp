import styled, { keyframes } from 'styled-components';

const boomBoomHeart = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

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


export const Container = styled.div`
 .overlay {
      display: flex;
      position: absolute;
      width: 100%;
      height: 1000vh;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      z-index: 999;
      transition: all 0.3s ease-in-out;

      &.show {
        display: block;
      }

      .wishlist-box {

        animation: ${fadeInFromDown} 0.6s ease-in-out;
      }
    }
`;

export const PlaceCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;
  min-width: 300px;
  margin: 0 10px 20px;
  border-radius: .8rem;

  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;

  .content-wrapper {
    padding: 20px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export const PlaceCardImageWrapper = styled.div`
    width: 100%;
    height: 290px;
    overflow: hidden;
    border-radius: .8rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .favorite-heart {
      position: absolute;
      top: 0.625rem;
      right: 0.625rem;
      font-size: 1.5rem;
      color: #ff8c91;
      cursor: pointer;

      &:hover {
        color: red;
        animation: ${boomBoomHeart} 0.3s ease;
      }

    }


    `;
