import styled from 'styled-components';

export const PlaceGalleryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .place-gallery-wrapper {
    margin-top: -2rem;
    border-top: 1px solid #dddddd;
  }

  ul {
    display: flex;
    list-style: none;
  }

    li {
        margin-right: 2rem;

        &:hover {
            cursor: pointer;
        }
    }
`;

export const MenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  position: relative;

  .underlineIndicator {
    position: absolute;
    bottom: -10px;
    height: 2px;
    width: 0;
    background-color: #2a2a2a;
    transition: all .3s ease;
}

  .icon-places-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 1.5rem;

    p {
      margin-top: .4rem;
      font-size: 1rem;
      font-weight: 400;
      color: #939393;
    }
  }

  button.active {
    cursor: pointer;
    color: #2a2a2a;
    border: none;
    transition: all .3s ease;
    background-color: transparent;
  }

  button.inactive {
    cursor: pointer;
    color: #2a2a2a;
    border: none;
    transition: all .3s ease;
    background-color: transparent;
  }
`;
