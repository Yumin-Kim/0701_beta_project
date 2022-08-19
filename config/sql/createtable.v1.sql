CREATE TABLE `Currencyprices` (
  `currencyprice` int(11) NOT NULL AUTO_INCREMENT,
  `ELC` int(11) DEFAULT NULL COMMENT 'ELC Token price\n',
  `XRP` int(11) DEFAULT NULL COMMENT '리플 가격',
  `KRW` int(11) DEFAULT NULL,
  `USDT` int(11) DEFAULT NULL,
  `createdt` datetime DEFAULT CURRENT_TIMESTAMP,
  `extrastr` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`currencyprice`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Files` (
  `file` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '파일 명',
  `attachment` longblob COMMENT '파일 base64저장',
  `size` int(11) DEFAULT NULL COMMENT '사이즈 기록',
  `type` varchar(45) DEFAULT NULL COMMENT '이미지 타입 정의 png jpg jpeg',
  `extracode` int(11) DEFAULT NULL,
  `extrastr` varchar(255) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `updatedt` datetime DEFAULT NULL,
  PRIMARY KEY (`file`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Wallets` (
  `wallet` int(11) NOT NULL AUTO_INCREMENT,
  `member` int(11) DEFAULT NULL COMMENT '지갑 소유 회원',
  `address` varchar(255) DEFAULT NULL COMMENT '지갑 주소',
  `currency` int(11) DEFAULT NULL COMMENT '지갑 종류',
  `amount` int(11) DEFAULT NULL COMMENT '소지 금액\n',
  `createdt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성날짜',
  `updatedt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정 날짜',
  `extrastr` varchar(45) DEFAULT NULL COMMENT '추가적인 정보\n',
  PRIMARY KEY (`wallet`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Lands` (
  `land` int(11) NOT NULL AUTO_INCREMENT,
  `landkey` int(11) DEFAULT NULL COMMENT '땅번호',
  `member` int(11) DEFAULT NULL,
  `extracode` int(11) DEFAULT NULL COMMENT '토지 상태 정보',
  `extrastr1` varchar(255) DEFAULT NULL COMMENT '부가적인 정보 지역 이름 등등',
  `extrastr2` varchar(45) DEFAULT NULL COMMENT '부가적인 정보 지역 이름 등등',
  `createdt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '셍성날짜',
  `updatedt` varchar(45) DEFAULT NULL COMMENT '업데이트 날짜',
  PRIMARY KEY (`land`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Transactions` (
  `transaction` int(11) NOT NULL AUTO_INCREMENT,
  `action` int(11) DEFAULT NULL COMMENT '사용자 주 행위',
  `status` int(11) DEFAULT NULL COMMENT '주행위에 상태 (1310 1320)',
  `extracode1` int(11) DEFAULT NULL COMMENT '주행위로 발생한 특정 행위 1',
  `extracode2` int(11) DEFAULT NULL COMMENT '주행위로 발생한 특정 행위 2',
  `extrastr1` varchar(255) DEFAULT NULL COMMENT '주행위로 발생한 특정 정보 1',
  `extrastr2` varchar(45) DEFAULT NULL COMMENT '주행위로 발생한 특정 정보 2',
  `extrastr3` json DEFAULT NULL COMMENT '주행위로 발생한 특정 정보 3 JSON',
  `createdt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedt` datetime DEFAULT CURRENT_TIMESTAMP,
  `member` int(11) DEFAULT NULL,
  `land` int(11) DEFAULT NULL,
  `file` int(11) DEFAULT NULL,
  `isdeleted` int(11) DEFAULT '1310' COMMENT '1310 디폴트\n1320 개발자 임의 삭제 데이터',
  PRIMARY KEY (`transaction`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `ResourceTransactions` (
  `resourcetransaction` int(11) NOT NULL AUTO_INCREMENT,
  `resource` int(11) DEFAULT NULL COMMENT '자원 종류',
  `amount` int(11) DEFAULT NULL COMMENT '자원 지급 수량',
  `tiles` int(11) DEFAULT NULL COMMENT '타일수',
  `minercount` int(11) DEFAULT NULL COMMENT '채굴기 수',
  `extracode` int(11) DEFAULT NULL COMMENT '특정 정보 입력',
  `extrastr1` varchar(255) DEFAULT NULL COMMENT '특정 정보 입력',
  `extrastr2` varchar(45) DEFAULT NULL COMMENT '특정 정보 입력',
  `createdt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedt` datetime DEFAULT NULL,
  `member` int(11) DEFAULT NULL,
  `transaction` int(11) DEFAULT NULL,
  `isdeleted` int(11) DEFAULT '1310' COMMENT '1310 디폴트\\n1320 개발자 임의 삭제 데이터',
  PRIMARY KEY (`resourcetransaction`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Members` (
  `member` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `pin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobilecode` int(11) DEFAULT NULL COMMENT '국가 전화 번호 코드',
  `phonenumber` varchar(255) DEFAULT NULL COMMENT '전화번호\n',
  `country` int(11) DEFAULT NULL COMMENT '국가 번호\n',
  `region` int(11) DEFAULT NULL COMMENT '지역 번호\n',
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `walletaddress` varchar(255) DEFAULT NULL COMMENT '지갑 주소\n',
  `gender` int(11) DEFAULT NULL COMMENT '성별\n',
  `age` int(11) DEFAULT NULL COMMENT '나이\n\n',
  `landcolor` varchar(255) DEFAULT NULL COMMENT '개인 소유 토지 색깔\n',
  `landimage` varchar(45) DEFAULT NULL COMMENT '소유 토지 첨부 이미지\n',
  `createdt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성 날짜\n',
  `updatedt` datetime DEFAULT NULL COMMENT '수정날짜\n',
  `extrastr` varchar(45) DEFAULT NULL,
  `extracode` int(11) DEFAULT NULL,
  PRIMARY KEY (`member`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

