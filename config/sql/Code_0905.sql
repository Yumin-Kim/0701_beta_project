-- -------------------------------------------------------------
-- TablePlus 4.8.2(436)
--
-- https://tableplus.com/
--
-- Database: wicfaie
-- Generation Time: 2022-09-05 13:33:31.7230
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `Code`;
CREATE TABLE `Code` (
  `code` int(11) NOT NULL,
  `subcode` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `extrastr1` varchar(45) DEFAULT NULL,
  `extrastr2` varchar(45) DEFAULT NULL,
  `extrastr3` varchar(45) DEFAULT NULL,
  `extracode` int(11) DEFAULT NULL,
  `createdt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Code` (`code`, `subcode`, `description`, `category`, `extrastr1`, `extrastr2`, `extrastr3`, `extracode`, `createdt`) VALUES
(1000, 0, '서버 서비스 상태 관련', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:19:53'),
(1100, 0, '서비스 상태', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1110, 1100, '정상', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1120, 1100, '오류', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1130, 1100, '버그 발생', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1200, 0, '서버 상태', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1210, 1200, '정상', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1220, 1200, '비정상', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1230, 1200, '이슈 발생', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1300, 0, '데이터 존재 여부', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1310, 1300, '정상', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(1320, 1300, '비정상', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6000, 0, '블록체인 관련', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:19:53'),
(6100, 0, '리플 거래 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6101, 6100, '리플 거래 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6102, 6100, '리플 거래 승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6103, 6100, '리플 거래 미 승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6104, 6100, '리플 신원 확인 불가 입금', NULL, NULL, NULL, NULL, NULL, '2022-08-25 07:03:51'),
(6200, 0, 'ELC 코인 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6201, 6540, '트론 거래 요청', NULL, NULL, NULL, NULL, NULL, '2022-09-01 01:08:23'),
(6202, 6540, '트론 거래 승인', NULL, NULL, NULL, NULL, NULL, '2022-09-01 01:08:23'),
(6300, 0, 'Swap 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6500, 0, '지갑 종류', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6503, 6540, '트론 거래 미 승인', NULL, NULL, NULL, NULL, NULL, '2022-09-01 01:08:23'),
(6504, 6540, '트론 거래 확인 불가 입금', NULL, NULL, NULL, NULL, NULL, '2022-09-01 01:08:23'),
(6510, 6500, '이더리움 지갑', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6520, 6500, '리플 지갑', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6530, 6500, '메인넷 지갑', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:27:08'),
(6540, 6500, '트론 지갑', NULL, NULL, NULL, NULL, NULL, '2022-09-01 01:08:23'),
(7000, 0, '토지 , 자원 관련', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:19:53'),
(7100, 0, '토지 소유 상태', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7110, 7100, '소유', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7120, 7100, '미소유', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7130, 0, '토지 구매 현황', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7131, 7130, '토지 구매 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7132, 7130, '토지 구매 승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7134, 7100, '토지 리플 승인 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-30 03:03:58'),
(7200, 0, '채굴 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7210, 0, '채굴기 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7211, 7210, '채굴기 구매 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7212, 7210, '채굴기 구매 승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7213, 7210, '채굴기 판매 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7214, 7210, '채굴기 판매 요청 승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7215, 7210, '채굴기 삭제 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7216, 7210, '채굴기 소멸', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7220, 0, '채굴기 상태 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7221, 7220, '채굴 시작', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7222, 7220, '채굴 진행중', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7223, 7220, '채굴 자원 할당 완료', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7224, 7220, '채굴 완료', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7500, 0, '자원 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7501, 7500, '물', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7502, 7500, '목재', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7503, 7500, '철광석', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7504, 7500, '석탄', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7505, 7500, '금', NULL, NULL, NULL, NULL, NULL, '2022-09-01 00:54:54'),
(7506, 7500, '은', NULL, NULL, NULL, NULL, NULL, '2022-09-01 00:54:54'),
(7507, 7500, '동', NULL, NULL, NULL, NULL, NULL, '2022-09-01 00:54:54'),
(7600, 0, '특수자원 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7601, 7600, '크립토 나이트', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(7602, 7600, '다이아몬드', NULL, NULL, NULL, NULL, NULL, '2022-09-01 00:54:54'),
(7700, 0, '건물', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(8000, 0, '관리자 관련', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:19:53'),
(8001, 8000, '판매자 지갑 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(8200, 0, '판매정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(8201, 8200, '토지 판매 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(8202, 8200, '채굴기 판매 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:04:06'),
(9000, 0, '사용자 관련', NULL, NULL, NULL, NULL, NULL, '2022-08-22 00:19:53'),
(9100, 0, '회원 가입 상태', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9110, 9100, '비회원', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9120, 9100, '회원', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9130, 9100, '로그인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9140, 9100, '로그아웃', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9150, 9100, '게정 삭제', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9210, 0, '성별', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9211, 9210, '남성', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9212, 9210, '여성', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9220, 0, '나이', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9300, 0, '인증 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9310, 0, '이메일 인증', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9311, 9310, '승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9312, 9310, '미승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9313, 9310, '보류', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9314, 9310, '승인 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9315, 9310, '비밀 번호 재 설정 인증', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9320, 0, '휴대폰 안증', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9321, 9320, '승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9322, 9320, '미승인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9323, 9320, '보류', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9410, 0, '커뮤니티 정보', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9411, 9410, '네이버 회원 가입', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9412, 9410, '페이스북 회원 가입', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9413, 9410, '인스타 회원가입', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9420, 0, '커뮤니티 로그인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9421, 9420, '네이버 로그인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9422, 9420, '페이스북 로그인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9423, 9420, '인스타 로그인', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9500, 0, '유틸', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9501, 9500, '추천인 코드 입력', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9900, 0, '채굴기 사용', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18'),
(9901, 9900, '채굴 요청', NULL, NULL, NULL, NULL, NULL, '2022-08-22 01:17:18');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;