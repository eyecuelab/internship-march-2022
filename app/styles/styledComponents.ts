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

export const SubHeader = styled.h2`
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  color: #ffffff;
`
export const InputLabel = styled.label`
  font-size: 1em;
  font-weight: bold;
  color: #ffffff;
`
export const InputField = styled.input`
  width: 315px;
  height: 55px;
  color: black;
  padding .5em;
  border-radius: 15px;
`
export const SearchBar = styled.input`
  background: rgba(47, 62, 70, 0.49);
  border-radius: 10px;
  &::placeholder {
    color: white;
    padding-left: 1em;
  }
`
export const RoundedRectangle = styled.div`
  max-width: 600px;
  height: max-content;
  margin: auto;
  margin-top: 1em;
  background: #52796f;
  border-radius: 13px;
  color: #ffffff;
  padding: 2em;
  font-size: 0.5em;
`
export const CostText = styled.text`
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  text-align: right;
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
export const NavButton = styled.div`
  display: flex;
  justify-content: center;
`
