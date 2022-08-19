module.exports = {
    resultResponseFormat: ({ data = null, status = 1320, msg = null, extraData = null }) => {
        if (extraData !== null) {
            return {
                data,
                status,
                msg,
                extraData
            }
        }
        else {
            return {
                data,
                status,
                msg
            }
        }
    },
    resultMSG: {
        intergrateMSG: {
            success: "정상적으로 처리되었습니다.",
            failure: "잘못된 정보를 입력하여 비정상적으로 처리되었습니다.",
            serverError: "서버 오류가 발생하였습니다.",
            notSendclientInfo: "사용자가 정보를 입력하지 않았습니다.",
            AWSsdfConnectionError: "AWS SDK 연결을 실패하였습니다.",
            awssesSuccess: ({ router }) => `[${router}] aws ses 이메일 인증 코드 전송 완료`,
            awssesFailure: ({ router }) => `[${router}] aws ses 이메일 인증 코드 전송 실패`
        },
        ece2000: {
            ece2310: {
                success: "이메일 인증 코드 전송 했습니다.",
                failure: "사용자 이메일 정보가 존재하지 않습니다. 이메일 인증 코드 전송 실패했습니다.",
                awssesError: "aws ses 서버 오류가 발생하였습니다.",
            },
            ece2320: {
                success: "이메인 인증 성공 , 회원",
                notFoundMember: "이메일 인증 성공 , 비회원",
                faliure: "인증 코드 오류로 인한 인증 실패하셨습니다.",
            },
            ece2323: {
                success: "회원 가입 성공",
                failure: "회원 가입 실패",
                validEmail: "존재하는 이메일이 있습니다."
            },
            ece2324: {
                success: "로그인 안내 페이지 접근",
                failure: "멤버 번호가 존재 하지 않습니다."
            },
            ece2324: {
                success: "로그인 성공"
            },
            ece2330: {
                success: "로그인 성공",
                failure: "비밀번호 오류"
            },
            ece2332: {
                success: "비밀 번호 재설정을 위한 이메일 인증 코드 전송",
                failure: "존재하지 않은 회원 입니다.",
            },
            ece2333: {
                success: "비밀 번호 재설정을 위한 이메일 인증 코드 인증 완료",
                failure: "인증 코드 오류 발생"
            },
            ece2334: {
                success: "비밀번호 재설정 완료",
                failure: "비밀번호 재설정 실패하였습니다."
            }
        },
        ece3000: {
            ece3200: {
                msg: "체굴 진행중",
            },
            ece3400: {
                success: "채굴 완료 하였습니다.",
                failure: "채굴할 자원이 없습니다."
            },
            ece3500: {
                success: "사용자 채굴 관련 정보 전송 완료"
            }
        },
        ece4000: {

        },
        ece5000: {
            ece5100: {
                success: "자원 통계 정보 조회 성공",
                failure: "자원 통계 정보 조회 실패"
            },
            ece5200: {
                success: "자원 통계 택스트 정보 제공 성공",
                failure: "자원 통계 택스트 정보 제공 실패"
            }
        },
        ece7000: {
            ece7100: {
                success: "사용자 정보 조회 성공"
            }
        },
        ece8000: {
            ece8110: {
                success: "판매자 정보 조회 완료",
                failure: "판매자 정보 조회 실패"
            },
            ece8120: {
                success: "토지 구매 요청 승인",
                failure: "토지 구매 승인 실패"
            },
            ece8210: {
                success: "판매자 정보 조회 완료",
                failure: "판매자 정보 조회 실패"
            },
            ece8220: {
                success: "채굴기 구매 요청 승인",
                failure: "채굴기 구매 요청 실패",
                notFoundMemberXRPWallerAddress: "사용자 리플 주소를 입력해주세요"
            }
        }
    }
}