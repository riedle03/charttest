// 차트 초기화
let pieChart = null;
let barChart = null;
let currentTopic = '';
const surveyData = {
    options: [],
    counts: []
};

// 랜덤 색상 생성 함수
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 차트 생성 함수
function createCharts() {
    // 파이 차트 생성
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) {
        pieChart.destroy();
    }
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: surveyData.options,
            datasets: [{
                data: surveyData.counts,
                backgroundColor: surveyData.options.map(() => getRandomColor()),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: currentTopic + ' - 응답 분포'
                }
            }
        }
    });

    // 바 차트 생성
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (barChart) {
        barChart.destroy();
    }
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: surveyData.options,
            datasets: [{
                label: '응답 수',
                data: surveyData.counts,
                backgroundColor: surveyData.options.map(() => getRandomColor()),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: currentTopic + ' - 응답 수'
                }
            }
        }
    });
}

// 인포그래픽 생성 함수
function createInfographic() {
    const total = surveyData.counts.reduce((a, b) => a + b, 0);
    const maxCount = Math.max(...surveyData.counts);
    const maxIndex = surveyData.counts.indexOf(maxCount);
    
    const summaryHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">총 응답 수</h5>
                        <p class="card-text display-4">${total}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">가장 많은 응답</h5>
                        <p class="card-text">${surveyData.options[maxIndex]}</p>
                        <p class="card-text">${maxCount}명 (${((maxCount/total)*100).toFixed(1)}%)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">평균 응답 수</h5>
                        <p class="card-text">${(total/surveyData.options.length).toFixed(1)}명</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('surveySummary').innerHTML = summaryHTML;
}

// 폼 제출 이벤트 처리
document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const topic = document.getElementById('surveyTopic').value;
    const option = document.getElementById('optionName').value;
    const count = parseInt(document.getElementById('optionCount').value);
    
    if (currentTopic === '') {
        currentTopic = topic;
    } else if (currentTopic !== topic) {
        alert('이전 조사 주제와 다른 주제는 입력할 수 없습니다.');
        return;
    }
    
    // 데이터 추가
    surveyData.options.push(option);
    surveyData.counts.push(count);
    
    // 차트 업데이트
    createCharts();
    
    // 폼 초기화 (주제 제외)
    document.getElementById('optionName').value = '';
    document.getElementById('optionCount').value = '';
});

// 조사 완료 버튼 이벤트 처리
document.getElementById('completeSurvey').addEventListener('click', function() {
    if (surveyData.options.length === 0) {
        alert('조사 데이터를 먼저 입력해주세요.');
        return;
    }
    
    createInfographic();
    
    // 데이터 초기화
    currentTopic = '';
    surveyData.options = [];
    surveyData.counts = [];
    
    // 폼 초기화
    document.getElementById('surveyForm').reset();
}); 
