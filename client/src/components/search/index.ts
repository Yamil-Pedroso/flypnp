import styled, { keyframes } from 'styled-components';

const growWrapperIcon = keyframes`
  from {
    width: 3.6rem;
  }
  to {
    width: 7rem;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 55rem;
  height: 4.5rem;
  margin: 2rem 0;
  border-radius: 10rem;
  background-color: #fff;
  border: 0.1rem solid #e5e5e5;
  border-radius: 3rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  position: relative;

  .search-wrapper {
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
