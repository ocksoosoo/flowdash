// header 내 기능 구현 JS 파일
/*
1. 시간대별 인사말
2. 날짜 출력(Date 객체)
3. 닉네임 인라인 수정 및 저장, enter 및 blur 이벤트 추가
(시간 남으면 최초 1회 랜덤 닉네임 생성 기능 추가)
4. 다크/라이트 모드 전환 및 저장
5. header UI 관련 기능
*/

// ===== Import =====
// import { LoadNickname, saveNickname, loadTheme, saveTheme } from './storage.js';


// ===== 초기화 =====
export function initHeader(todos) {
    // 나중에 구현
}


// DOM 요소 선택
const greeting = document.querySelector('.td-header__text-sub');
const nickname = document.querySelector('.td-header__brand-name');
const todayDate = document.querySelector('.td-header__date');
const toggleBtn = document.querySelector('.td-header__theme-toggle');

// 닉네임 기본값 & LocalStorage 값 설정
const DEFAULT_NICKNAME = "FlowDash";
const STORAGE_KEYS = {
    theme: "flowdash-theme",
    nickname: "flowdash-nickname",
};

// LocalStorage 불러오기
function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme);
};
function getNickname() {
    return localStorage.getItem(STORAGE_KEYS.nickname) || defaultNickname
};


// 시간대에 따라 달라지는 인삿말 구현
// 1. 시간 데이터를 불러오기
// 2. 시간대별로 인삿말 구역의 텍스트를 변경하기
/*
- 05–11: 좋은 아침이에요
- 11–17: 좋은 오후에요
- 17–22: 좋은 저녁이에요
- 그 외: 안녕하세요*/

// getGreeting(): 시간 값 저장 및 시간대별 문자열 반환 함수
function getGreeting() {
     // 현재 시간의 hour만 가져오기
     const hour = new Date().getHours();

     if(hour >= 5 && hour < 11) {
        return "좋은 아침이에요!";
    } else if(hour >= 11 && hour < 17) {
        return "좋은 오후예요!";
    } else if(hour >= 17 && hour < 22) {
        return "좋은 저녁이에요!";
    } else {
        return "안녕하세요!";
    }
}

// renderGreeting(): 시간대별로 다르게 인삿말을 바꿔주는 렌더링 함수
function renderGreeting() {
    greeting.textContent = getGreeting();
}


// applyTheme(): 테마 적용 함수
// saveTheme(): 테마 저장 함수
// 1. 저장된 테마 가져와서 적용
// 2. LocalStorage에 저장
// 3. 클릭 이벤트는 나중에 이벤트 함수 적을 때 한번에

function applyTheme() {
    if(theme === "dark") {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

function saveTheme() {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    applyTheme(theme);
}


// 닉네임 인라인 수정 및 저장




// eventListener(): 모드 전환 클릭 이벤트, 닉네임 수정시 enter와 blur 이벤트
// enter 및 blur 이벤트 추가
