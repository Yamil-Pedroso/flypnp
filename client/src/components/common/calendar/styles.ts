import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0rem;
  box-sizing: border-box;
  position: relative;

  .calendar-opt-container {
      position: relative;
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        position: absolute;
        top: -3rem;
        left: 35%;


        li {
          padding: .5rem 1rem;
          cursor: pointer;
          font-size: 1.2rem;
          color: #686868;
        }

        .date, .months, .flexible {
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          cursor: pointer;

          .horizontal-line {
            width: 4rem;
            height: 2px;
            background-color: #9b9b9b;
            transition: all 0.5s ease;
          }
        }

      }
  }

  .exact-days-container {
    display: flex;
    margin-top: 1.25rem;
  }

  .exact-days-container .exact-days-text {
    margin-right: 0.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 6.5rem;
    padding: .7rem;
    border-radius: 10rem;
    border: 1px solid #e0e0e0;
    cursor: pointer;

    &.black-border {
        border: 2px solid #2a2a2a;
        background-color: #2a2a2a;
        color: #fff;
    }
  }

  .exact-days-options-wrapper {
    display: flex;
  }

  .exact-days-options-wrapper .exact-days-option {
    margin-right: 0.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 6.5rem;
    padding: .2rem 2rem;
    border-radius: 10rem;
    border: 1px solid #e0e0e0;
    cursor: pointer;

    &.black-border {
        border: 2px solid #2a2a2a;
        background-color: #2a2a2a;

        .content p, .content .icon {
        color: #fff;
        }
    }
  }

  .content {
    display: flex;
  }

  .number {
    font-size: .9rem;
  }

  .number, .text {
    color: #686868;
  }

  .content > div {
        margin: 0 0.1rem;
    }

    .months-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 53.0744rem;
      height: 22.7813rem;
    }

    .flexible-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 53.0744rem;
      height: 22.7813rem;
    }
`;
