document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('business-card');
    const coverLetter = document.getElementById('cover-letter');
    const scene = document.getElementById('scene');
    
    const BASE_WIDTH = 600;
    const BASE_HEIGHT = 360;
    const BASE_RADIUS = 16;
    
    function updateAnimation() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        
        if (maxScroll <= 0) return;
        
        let ratio = scrollY / maxScroll;
        ratio = Math.max(0, Math.min(1, ratio));
        
        // 애니메이션 구간(Phase) 정의
        // Phase 1 (0.0 ~ 0.35): 비스듬한 상태에서 정면으로 뒤집히기
        const phase1End = 0.35;
        let p1 = Math.min(ratio / phase1End, 1);
        
        // Phase 2 (0.35 ~ 0.75): 정면 상태에서 화면 꽉 차게 확대되기
        const phase2Start = phase1End;
        const phase2End = 0.75;
        let p2 = ratio <= phase2Start ? 0 : Math.min((ratio - phase2Start) / (phase2End - phase2Start), 1);
        
        // Phase 3 (0.75 ~ 1.0): 텍스트 페이드인
        const phase3Start = phase2End;
        const phase3End = 1.0;
        let p3 = ratio <= phase3Start ? 0 : Math.min((ratio - phase3Start) / (phase3End - phase3Start), 1);
        
        // [Phase 1] 3D Transform 계산
        // 초기값: X 60deg, Z -30deg, Y 0deg
        // 목표값: X 0deg, Z 0deg, Y 180deg (명함 뒷면)
        // 약간의 easing(이차 함수) 적용하여 부드럽게
        const easeP1 = p1 * (2 - p1); 
        const rotX = 60 * (1 - easeP1);
        const rotZ = -30 * (1 - easeP1);
        const rotY = 180 * easeP1;
        
        card.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZ}deg) rotateY(${rotY}deg)`;
        
        // [Phase 2] Width, Height, Border-Radius 조절
        // 반응형 기본 크기
        let isMobile = window.innerWidth <= 768;
        let startW = isMobile ? window.innerWidth * 0.9 : BASE_WIDTH;
        let startH = isMobile ? window.innerWidth * 0.55 : BASE_HEIGHT;
        
        let targetW = window.innerWidth;
        let targetH = window.innerHeight;
        
        // p2에 easing 적용하여 부드러운 확대
        const easeP2 = p2 < 0.5 ? 2 * p2 * p2 : -1 + (4 - 2 * p2) * p2;
        
        let currentW = startW + (targetW - startW) * easeP2;
        let currentH = startH + (targetH - startH) * easeP2;
        let currentRadius = BASE_RADIUS * (1 - easeP2);
        
        // 명함이 뒤집히기 전(p1 < 1)에는 기본 크기 유지
        if (p1 < 1) {
            currentW = startW;
            currentH = startH;
            currentRadius = BASE_RADIUS;
        }
        
        card.style.width = `${currentW}px`;
        card.style.height = `${currentH}px`;
        
        const faces = document.querySelectorAll('.card-face');
        faces.forEach(face => {
            face.style.borderRadius = `${currentRadius}px`;
        });
        
        // [Phase 3] 텍스트 등장
        coverLetter.style.opacity = p3;
        
        // 스크롤이 거의 끝에 도달했을 때 이력서 내용 스크롤을 위해 활성화
        if (ratio > 0.99) {
            coverLetter.classList.add('active');
            scene.style.pointerEvents = 'auto'; 
        } else {
            coverLetter.classList.remove('active');
            scene.style.pointerEvents = 'none';
        }
    }
    
    // 부드러운 애니메이션을 위해 requestAnimationFrame 활용
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateAnimation();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    window.addEventListener('resize', () => {
        window.requestAnimationFrame(updateAnimation);
    });
    
    // 초기 세팅
    updateAnimation();
});
