import styled from "styled-components";

export const PaymentContainer = styled.div`
    display: flex;
    justify-content: space-around;
    width: 50rem;
    margin: 0 auto;

    .left-cont {

    }

    .date-guests-wrapper {
        margin-top: 1.5rem;
        .dates-cont, .guests-cont {
            margin-bottom: 1rem;
        }
    }

    .dates-cont, .guests-cont {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .edit-wrapper {
            cursor: pointer;
            text-decoration: underline;
        }
    }

    .payment-form {
        margin-top: 1.5rem;
        .input-wrapper.credit-card {
            input {
                padding-left: 2.5rem;
            }
        }
        .input-wrapper {
            margin: 1rem 0;

            .credit-card-icon {
                position: absolute;
                margin: 1rem;
            }

            .card-number {
                position: relative;
                input {
                    width: 100%;
                    padding: 1rem;
                    border: 1px solid #d4d4d4;
                }

                .lock-icon {
                    position: absolute;
                    right: 1rem;
                    top: .9rem;
                }
            }

            input {
                width: 100%;
                padding: 1rem;
                border: 1px solid #d4d4d4;

            }

            .exp-cvv-wrapper {
                display: flex;
                input {
                    width: 50%;

                }

            }

            .billing-address-wrapper {
                display: flex;
                flex-direction: column;
                margin-top: 1rem;
                input {

                }

                .state-zip-wrapper {
                    display: flex;

                    input {
                        width: 50%;
                    }
                }

                #country {
                    margin-top: 1rem;
                }
            }
        }
        .payment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .pay-mode-wrapper {
                display: flex;
                align-items: center;
                gap:.4rem;
            }
        }

    }

    .right-cont {
        width: 50%;
        height: 40vh;
        border: 1px solid #d4d4d4;
        padding: 1.5rem 1.5rem;
    }
`;
