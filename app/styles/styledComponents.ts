import { Link } from "remix"

import styled from "styled-components"

// font-family: 'Lato', sans-serif;
// font-family: 'Playfair Display', serif;

export const MainBtn = styled.button`
  width: 276.07px;
  height: 56px;
  background: #cad2c5;
  border-radius: 15px;
`
export const ClearBtn = styled(MainBtn)`
  box-sizing: border-box;
  background: rgba(202, 210, 197, 0);
  font-family: "Lato", sans-serif;
  color: #ffffff;
`
export const SmMainBtn = styled(MainBtn)`
  width: 153px;
  height: 56px;
`
export const SmClearBtn = styled(ClearBtn)`
  width: 153px;
  height: 56px;
  color: #ffffff;
`

export const Header = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 2em;
  margin: 1em auto 1em 1em;
  color: #ffffff;
`

export const SubHeader = styled.h3`
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  color: #ffffff;
`

export const SearchBar = styled.input`
  font-family: "Lato";
  padding-left: 3em;
  background: #6b767c
    url("data:image/svg+xml,%3Csvg width='16' height='15' viewBox='0 0 16 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.05465 12.5555C10.5651 12.5555 13.4109 9.96875 13.4109 6.77777C13.4109 3.5868 10.5651 1 7.05465 1C3.54417 1 0.698364 3.5868 0.698364 6.77777C0.698364 9.96875 3.54417 12.5555 7.05465 12.5555Z' stroke='white' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15.0001 14L11.5438 10.8583' stroke='white' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
    no-repeat 13px center;
  border-radius: 10px;
  &::placeholder {
    color: white;
  }
`
export const MapInputField = styled(SearchBar)`
  font-family: "Lato";
  width: 342px;
  height: 39px;
  color: white;
  padding-left: 3em;
  background: rgba(0, 0, 0, 0.6)
    url("data:image/svg+xml,%3Csvg width='16' height='15' viewBox='0 0 16 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.05465 12.5555C10.5651 12.5555 13.4109 9.96875 13.4109 6.77777C13.4109 3.5868 10.5651 1 7.05465 1C3.54417 1 0.698364 3.5868 0.698364 6.77777C0.698364 9.96875 3.54417 12.5555 7.05465 12.5555Z' stroke='white' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15.0001 14L11.5438 10.8583' stroke='white' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
    no-repeat 13px center;
  border: 1px solid #000000;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  &::placeholder {
    color: white;
  }
`

export const InputLabel = styled.label`
  font-size: 1em;
  font-weight: bold;
  color: #ffffff;
`
export const InputField = styled.input`
  width: 315px;
  weight: semi-bold;
  height: 55px;
  color: black;
  padding .5em;
  border-radius: 15px;`

export const InputFieldMid = styled.input`
  width: 276px;
  weight: semi-bold;
  height: 55px;
  color: black;
  padding .5em;
  border-radius: 15px;`

export const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`
export const RoundedRectangle = styled.div`
  height: max-content;
  margin: auto;
  margin-top: 1em;
  background: #52796f;
  border-radius: 13px;
  color: #ffffff;
  padding: 2em;
  font-size: 0.5em;
`
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(55, 71, 80, 0.68);
`
export const Modal = styled.div`
  position: absolute;
  width: 100vw;
  bottom: 0;
  height: auto;
  border: 2px;
  background: #2a3840;
  border-radius: 20px 20px 0px 0px;
`
export const CostAmount = styled.h3`
  font-family: Lato;
  font-style: SemiBold;
  font-size: 18px;
  color: #ffffff;
  align: right;
`
export const TitleText = styled.h3`
  font-family: Lato;
  font-style: SemiBold;
  font-size: 16px;
  color: #ffffff;
`
export const CostDescription = styled.h4`
  font-family: Lato;
  font-style: SemiBold;
  font-size: 16px;
  color: #ffffff;
`
export const AddButtonText = styled.h4`
Font family: Lato;
Font style: Bold;
Font size: 14px;
Line height: 17px;
Line height: 100%;
color: #ffffff;
`
export const ErrorDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
`

export const TripBtn = styled(MainBtn)`
  width: 90%;
  margin: 0.5em 0;
  font-family: "Lato";
  font-weight: 700;
  font-size: 16px;
`
export const TripLiContainer = styled.li`
  background: #52796f;
  font-family: "Lato";
  color: white;
  border-radius: 13px;
  margin: 1em auto;
  text-align: center;
  width: 324px;
`
export const TripHr = styled.hr`
  margin: 1em;
  border: 1px solid rgba(255, 255, 255, 0.19);
`
export const TripLiImage = styled.img`
  border-radius: 13px 13px 0px 0px;
  object-fit: cover;
  height: 109px;
  width: 324px;
  margin-bottom: 1em;
`
export const TripLiTitle = styled.h1`
  font-size: 18px;
  line-height: 22px;
  text-transform: capitalize;
`
export const TripLiFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`
export const TripLiGroup = styled.h3`
  flex: 1 1 30%;
  font-size: 14px;
  line-height: 17px;
  text-transform: capitalize;
`
export const TripLiDetail = styled.h2`
  flex: 1 1 30%;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  text-transform: capitalize;
  margin-bottom: 1em;
`
export const NavButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`
