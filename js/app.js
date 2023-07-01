const audio = (() => {
    var instance = undefined;

    var getInstance = () => {
        if (!instance) {
            instance = new Audio();
            instance.autoplay = true;
            instance.src = document.getElementById('tombol-musik').getAttribute('data-url');
            instance.load();
            instance.currentTime = 0;
            instance.volume = 1;
            instance.muted = false;
            instance.loop = true;
        }

        return instance;
    };

    return {
        play: () => {
            getInstance().play();
        },
        pause: () => {
            getInstance().pause();
        }
    };
})();

const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const salin = (btn) => {
    navigator.clipboard.writeText(btn.getAttribute('data-nomer'));
    let tmp = btn.innerHTML;
    btn.innerHTML = 'Tersalin';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = tmp;
        btn.disabled = false;
        btn.focus();
    }, 1500);
};

const timer = () => {
    var countDownDate = (new Date(document.getElementById('tampilan-waktu').getAttribute('data-waktu').replace(' ', 'T'))).getTime();
    var time = undefined;
    var distance = undefined;

    time = setInterval(() => {
        distance = countDownDate - (new Date()).getTime();

        if (distance < 0) {
            clearInterval(time);
            time = undefined;
            return;
        }

        document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('detik').innerText = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
};

const buka = async () => {
    document.getElementById('tombol-musik').style.display = 'block';
    audio.play();
    AOS.init();
    await login();
    timer();
};

const play = (btn) => {
    if (btn.getAttribute('data-status').toString() != 'true') {
        btn.setAttribute('data-status', 'true');
        audio.play();
        btn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
    } else {
        btn.setAttribute('data-status', 'false');
        audio.pause();
        btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    }
};



const progressBar = (() => {
    let bar = document.getElementById('bar');
    let clear = null;
    let second = 1;
    let counter = 1;
    let untilOneHundred = parseInt(bar.style.width.replace('%', ''));

    clear = setInterval(() => {

        if (untilOneHundred < 100) {
            untilOneHundred = (counter + (untilOneHundred / 10)) / (second + (untilOneHundred / 100));
            setNum(untilOneHundred);
        } else {
            clearInterval(clear);
        }

        if (counter % 100 == 0) {
            second += 1;
        }

        counter += 1;
    }, 10);

    let setNum = (num) => {
        bar.style.width = num + "%";
        bar.innerText = Math.floor(num) + "%";
    };

    return {
        stop: () => {
            clearInterval(clear);
            setNum(100.0);
        }
    };
})();

const opacity = () => {
    let modal = new Promise((res) => {
        let clear = null;
        clear = setInterval(() => {
            if (document.getElementById('exampleModal').classList.contains('show')) {
                clearInterval(clear);
                res();
            }
        }, 100);
    });

    modal.then(() => {
        progressBar.stop();

        let op = parseInt(document.getElementById('loading').style.opacity);
        let clear = null;

        clear = setInterval(() => {
            if (op >= 0) {
                op -= 0.025;
                document.getElementById('loading').style.opacity = op;
            } else {
                clearInterval(clear);
                document.getElementById('loading').remove();
                document.getElementById('exampleModal').classList.add('fade');
            }
        }, 10);
    });
};

const modalFoto = (btn) => {
    let modal = new bootstrap.Modal('#modalFoto');
    let img = document.getElementById('showModalFoto');
    img.src = btn.src;
    modal.show();
};

window.addEventListener('load', () => {
    let modal = new bootstrap.Modal('#exampleModal');
    let name = (new URLSearchParams(window.location.search)).get('to') ?? '';

    if (name.length == 0) {
        document.getElementById('namatamu').remove();
    } else {
        let div = document.createElement('div');
        div.classList.add('m-2');
        div.innerHTML = `
        <p class="mt-0 mb-1 mx-0 p-0 text-light">Kepada Yth Bapak/Ibu/Saudara/i</p>
        <h2 class="text-light">${escapeHtml(name)}</h2>
        `;

        document.getElementById('formnama').value = name;
        document.getElementById('namatamu').appendChild(div);
    }

    modal.show();
    opacity();
}, false);

