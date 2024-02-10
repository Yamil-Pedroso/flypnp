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

export const PlaceCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;
  min-width: 300px;
  margin: 0 10px 20px;
  border-radius: .8rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  .content-wrapper {
    padding: 20px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export const PlaceCardImageWrapper = styled.div`
    position: relative;
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
