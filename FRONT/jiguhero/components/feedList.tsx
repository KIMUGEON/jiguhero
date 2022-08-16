import { ParentsDiv } from "styles/styled";
import styled from "styled-components";
import Backcomponents from "components/back";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useRecoilState, useRecoilValue } from "recoil";
import { UserId } from "states/user";
import {
  allauthImgList,
  feedImgList,
  feedList,
  feedUserInfoList,
} from "states/mission";
import userData from "pages/api/user/[id]";
import getFeedInfo from "pages/api/mission/getFeedInfo";
import { theme } from "components/theme";
import postFeedLike from "pages/api/mission/postfeedLike";

const NickNameT = styled("a")`
  font-size: medium;
  font-weight: bold;
  margin-left: 10px;
`;
const HeartDiv = styled("div")`
  display: inline-flex;
  a {
    font-weight: bold;
    font-size: small;
  }
`;
const BorderHeart = styled(FavoriteBorderRoundedIcon)`
  color: coral;
  margin-right: 10px;
  font-size: x-large;
  :hover {
    cursor: pointer;
  }
`;
const FullHeart = styled(FavoriteRoundedIcon)`
  color: coral;
  margin-right: 10px;
  font-size: x-large;
  :hover {
    cursor: pointer;
  }
`;
const TextDiv = styled("div")`
  font-weight: bold;
  font-size: large;
  margin: 5px;
  /* @media only screen and (min-width: 650px) {
    font-size: x-large;
  } */
`;
const ContentDiv = styled("div")``;
const FeedDiv = styled("div")`
  margin-bottom: 30px;
`;

const NickNameBlock = styled("div")`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  @media only screen and (max-width: 650px) {
    margin-top: 20px;
  }
`;

const BgImg = styled("div")<{ color1: string; color2: string }>`
  position: relative;
  width: 60px;
  height: 60px;
  @media screen and (max-width: 420px) {
    width: 50px;
    height: 50px;
  }

  border: 1px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(
    to bottom,
    ${(props) => props.color1},
    ${(props) => props.color2}
  );
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    display: flex;
    align-items: center;
    left: 4.5px;
    top: 4.5px;
    justify-content: center;
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    @media screen and (max-width: 420px) {
      width: 40px;
      height: 40px;
      left: 3.8px;
      top: 3.8px;
    }
  }
`;

// interface IProps {
//   item?: Array<string>;
//   index?: number;
// }

export default function FeedList({ item, index }) {
  console.log(item);
  const [missionList, setMissionList] = useRecoilState<[][]>(allauthImgList);
  const [heart, setHeart] = useState(false);

  const [userId] = useRecoilValue(UserId);

  // [grade, nickname, feedUserId, imgUrl]
  const [feedUserInfoLists, setFeedUserInfoLists] =
    useRecoilState(feedUserInfoList);

  const [grd, setGrd] = useState<number>();
  const [nick, setNick] = useState<string>();
  const [feedUserId, setFeedUserId] = useState<number>();
  const [imgUrl, setImgUrl] = useState<string>();

  const [content, setContent] = useState("");
  const [likeCheck, setLikeCheck] = useState(false);
  const [likeCnt, setLikeCnt] = useState(0);
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");

  useEffect(() => {
    var mama = [];
    if (item) {
      var data = userData(item[2])
        .then((res) => {
          if (res.grade === 0) {
            setColor1(theme.Bunhong.first);
            setColor2(theme.Bunhong.second);
          } else if (res.grade === 1) {
            setColor1(theme.Norang.first);
            setColor2(theme.Norang.second);
          } else if (res.grade === 2) {
            setColor1(theme.Chorok.first);
            setColor2(theme.Chorok.second);
          } else if (res.grade === 3) {
            setColor1(theme.Parang.first);
            setColor2(theme.Parang.second);
          } else if (res.grade === 4) {
            setColor1(theme.Bbalgang.first);
            setColor2(theme.Bbalgang.second);
          }
          setGrd(res.grade);
          setNick(res.nickname);
          setFeedUserId(res.userId);
          setImgUrl(res.imageURL);
        })
        .then((res) => {
          // mama.push(res);
          // setList(mama);
        });
    }
    // setFeedUserInfoLists(list);
  }, []);

  useEffect(() => {
    var ma = [];
    if (item) {
      getFeedInfo(item[0], userId)
        .then((res) => {
          setLikeCheck(res.likeCheck);
          setContent(res.content);
          setLikeCnt(res.likeCnt);
          // var tmpdata = [res.likeCheck, res.content, res.likeCnt];
          // return tmpdata;
        })
        .then((res) => {
          // ma.push(res);
          // setFeedInfo(ma);
        });
    }
    // setFeedImgLists(feedInfo);
  }, [heart]);

  return (
    <>
      {item && (
        <FeedDiv>
          <NickNameBlock>
            <BgImg color1={color1} color2={color2}>
              <img src={imgUrl} />
            </BgImg>
            <NickNameT>{nick}</NickNameT>
          </NickNameBlock>

          <img className="feedimage" src={item[1]} />

          <ContentDiv>
            <TextDiv>
              <span>{content}</span>
            </TextDiv>
            <HeartDiv
              onClick={(e) => {
                e.preventDefault();
                setHeart(!heart);
                postFeedLike(item[0],userId)
              }}
            >
              {likeCheck ? <FullHeart /> : <BorderHeart />}
              <a>{`좋아요 ${likeCnt}개`}</a>
            </HeartDiv>
            <hr />
          </ContentDiv>
        </FeedDiv>
      )}
    </>
  );
}
