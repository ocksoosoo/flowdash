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
import { loadNickname, saveNickname, loadTheme, saveTheme } from './storage.js';



// DOM 요소 선택
const body = document.querySelector('body');
const greeting = document.querySelector('.td-header__text-sub');
const nickname = document.querySelector('.td-header__brand-name');
const todayDate = document.querySelector('.td-header__date');
const toggleBtn = document.querySelector('.td-header__theme-toggle');

// 상수
const DEFAULT_NICKNAME = "FlowDash";
const ANIMALS = [
    "고양이",
    "토끼",
    "강아지",
    "개구리",
    "병아리",
    "햄스터",
    "오리",
    "펭귄",
    "호랑이",
    "돌고래",
    "거북이",
    "카피바라"
];
const ADJECTIVES = [
    "행복한",
    "졸린",
    "귀여운",
    "용맹한",
    "차분한",
    "행운의",
    "멋진",
    "아름다운",
    "화려한",
    "여유로운",
    "재치있는"
];


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
};


// updateDate(): 오늘 날짜로 업데이트하여 프로필 카드에 출력
function updateDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const weekDays = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayOfWeek = weekDays[date.getDay()];

    const formattedDate = `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;

    todayDate.textContent = formattedDate;
};


function applyTheme(theme) {
    if(theme === "dark") {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
}


// 예외 처리(빈 값) -> 이전 값 || 기본값


// editNickname(): input을 추가하여 닉네임을 수정하는 함수
function editNickname() {
    if(nickname.querySelector('input')) return;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('td-header__nickname-input');
    input.value = loadNickname();
    // Enter 시 닉네임 저장
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            submitNickname(input);
        }
    });
    // blur 시 닉네임 저장
    input.addEventListener('blur', () => {
        submitNickname(input);
    });

    nickname.textContent = '';
    nickname.appendChild(input);
    input.focus();
};

// submiteNickname(): input 값을 불러와서 로컬 스토리지에 저장하고 렌더링하는 함수
function submitNickname(input) {
    const preNickname = loadNickname() || DEFAULT_NICKNAME;
    const newNickname = input.value.trim() || preNickname;
    // local에 저장
    saveNickname(newNickname);
    nickname.textContent = newNickname;
}

// getRandomNickname(): 닉네임 최초 생성시 1회에 한하여 랜덤 닉네임 생성
function getRandomNickname() {
    const adjectiveIndex = Math.floor(Math.random() * ADJECTIVES.length);
    const animalIndex = Math.floor(Math.random() * ANIMALS.length);

    const adjective = ADJECTIVES[adjectiveIndex];
    const animal = ANIMALS[animalIndex];
    const number = Math.floor(Math.random() * 90) + 10;

    return `${adjective} ${animal}${number}`;
};


// 모드 토글 버튼 이벤트
/*
1. toggle.Btn에 클릭 이벤트 추가
// 버튼 클릭시 body에 'dark' 클래스 추가
*/

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const currentTheme = body.classList.contains('dark')
    ? 'dark'
    : 'light';
    saveTheme(currentTheme);
});

nickname.addEventListener('click', editNickname);



// ===== 초기화 =====
export function initHeader() {
    updateDate();

    const savedTheme = loadTheme() || 'light';
    let savedNickname = loadNickname();
    // 저장된 닉네임이 없으면 랜덤 닉네임 생성
    if(!savedNickname) {
        savedNickname = getRandomNickname();
        savedNickname(savedNickname);
    }
    nickname.textContent = savedNickname;

    applyTheme(savedTheme);
    renderGreeting();
}