/* FUNÇÃO SCROLL */
window.addEventListener("scroll", function () {
    const nav = document.getElementById("navbar");
    if (window.scrollY > window.innerHeight * 0.8) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});


/* MENU HAMBURGUER */
const hamburguer = document.getElementById("hamburguer");
const menu = document.getElementById("menu");
const menuSectionLinks = document.querySelectorAll('#menu > a[href^="#"]');

const closeMobileMenu = () => {
    menu?.classList.remove("active");
    hamburguer?.classList.remove("active");
};

const setActiveMenuLink = (sectionId) => {
    menuSectionLinks.forEach(link => {
        link.classList.toggle("active-link", link.getAttribute("href") === `#${sectionId}`);
    });
};

hamburguer?.addEventListener("click", () => {
    menu?.classList.toggle("active");
    hamburguer.classList.toggle("active");
});

menuSectionLinks.forEach(link => {
    link.addEventListener("click", () => {
        setActiveMenuLink(link.getAttribute("href").replace("#", ""));
        closeMobileMenu();
    });
});


document.addEventListener("DOMContentLoaded", function () {
    /* POP-UP DE BOAS-VINDAS */
    const welcomePopup = document.getElementById("welcome-popup");
    const popupCloseButtons = document.querySelectorAll("[data-popup-close]");
    const categoryDPopup = document.getElementById("category-d-popup");
    const categoryPopupCloseButtons = document.querySelectorAll("[data-category-popup-close]");
    const categoryDPopupCta = document.getElementById("category-d-popup-cta");
    let categoryDPopupWasShown = false;

    const fecharPopup = popup => {
        popup?.classList.remove("is-open");
        popup?.setAttribute("aria-hidden", "true");
    };

    const abrirCategoryDPopup = () => {
        if (!categoryDPopup || categoryDPopupWasShown) {
            return;
        }

        categoryDPopupWasShown = true;
        categoryDPopup.classList.add("is-open");
        categoryDPopup.setAttribute("aria-hidden", "false");
        categoryDPopup.querySelector(".welcome-popup__close")?.focus();
    };

    const fecharWelcomePopup = () => {
        if (!welcomePopup?.classList.contains("is-open")) {
            return;
        }

        fecharPopup(welcomePopup);
    };

    // Independente do pop-up de boas-vindas: exibe o anúncio mesmo se ele estiver desativado.
    window.setTimeout(abrirCategoryDPopup, 500);

    if (welcomePopup) {
        window.setTimeout(() => {
            welcomePopup.classList.add("is-open");
            welcomePopup.setAttribute("aria-hidden", "false");
            welcomePopup.querySelector(".welcome-popup__close")?.focus();
        }, 500);

        popupCloseButtons.forEach(button => {
            button.addEventListener("click", fecharWelcomePopup);
        });
    }

    // Os controles da Categoria D não dependem da existência do pop-up de boas-vindas.
    categoryPopupCloseButtons.forEach(button => {
        button.addEventListener("click", () => fecharPopup(categoryDPopup));
    });

    categoryDPopupCta?.addEventListener("click", () => {
        fecharPopup(categoryDPopup);
        document.getElementById("d")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (categoryDPopup?.classList.contains("is-open")) {
                fecharPopup(categoryDPopup);
            } else {
                fecharWelcomePopup();
            }
        }
    });

    const menuSections = Array.from(menuSectionLinks)
        .map(link => document.getElementById(link.getAttribute("href").replace("#", "")))
        .filter(Boolean);

    if (menuSections.length > 0) {
        let menuScrollFrame = null;

        const updateActiveMenuLink = () => {
            const nav = document.getElementById("navbar");
            const activationLine = (nav?.offsetHeight || 0) + window.innerHeight * 0.35;
            const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
            let activeSection = menuSections[0];

            menuSections.forEach(section => {
                if (section.getBoundingClientRect().top <= activationLine) {
                    activeSection = section;
                }
            });

            if (pageBottom) {
                activeSection = menuSections[menuSections.length - 1];
            }

            setActiveMenuLink(activeSection.id);
        };

        const scheduleActiveMenuUpdate = () => {
            if (menuScrollFrame) {
                return;
            }

            menuScrollFrame = window.requestAnimationFrame(() => {
                updateActiveMenuLink();
                menuScrollFrame = null;
            });
        };

        const initialSection = location.hash
            ? menuSections.find(section => `#${section.id}` === location.hash)
            : menuSections[0];

        setActiveMenuLink((initialSection || menuSections[0]).id);
        updateActiveMenuLink();

        window.addEventListener("scroll", scheduleActiveMenuUpdate, { passive: true });
        window.addEventListener("resize", scheduleActiveMenuUpdate);
    }

    /* FUNÇÃO ANIMAÇÃO QUEM SOMOS */
    const historySection = document.querySelector(".history");

    if (historySection) {
        const showHistorySection = () => {
            historySection.classList.add("show");
        };

        const hideHistorySection = () => {
            historySection.classList.remove("show");
        };

        if ("IntersectionObserver" in window) {
            const historyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        showHistorySection();
                    } else {
                        hideHistorySection();
                    }
                });
            }, {
                threshold: 0.35,
                rootMargin: "0px 0px -12% 0px"
            });

            historyObserver.observe(historySection);
        } else {
            showHistorySection();
        }
    }

    /* FUNÇÃO CAMINHO DA HISTÓRIA */
    const journeySteps = document.querySelectorAll(".journey-step");
    const journeyTitle = document.getElementById("journey-title");
    const journeyText = document.getElementById("journey-text");
    const journeyCard = document.querySelector(".journey-card");

    const storyContent = {
        sonho: {
            title: "Um sonho que virou autoescola",
            text: "A Evolução nasceu da vontade de ensinar direção com mais proximidade, cuidado e propósito."
        },
        experiencia: {
            title: "Experiência prática de verdade",
            text: "Anos formando alunos e aperfeiçoando condutores ajudaram a criar um ensino mais humano e seguro."
        },
        suporte: {
            title: "Apoio em cada etapa da CNH",
            text: "Do primeiro contato até a conclusão do processo, a missão é simplificar o caminho do aluno."
        }
    };

    const changeStory = (storyKey) => {
        const selectedStory = storyContent[storyKey];

        if (!selectedStory || !journeyTitle || !journeyText || !journeyCard) {
            return;
        }

        journeySteps.forEach(step => {
            step.classList.toggle("active", step.dataset.story === storyKey);
        });

        journeyTitle.textContent = selectedStory.title;
        journeyText.textContent = selectedStory.text;
        journeyCard.classList.remove("changing");
        void journeyCard.offsetWidth;
        journeyCard.classList.add("changing");
    };

    journeySteps.forEach(step => {
        step.addEventListener("mouseenter", () => changeStory(step.dataset.story));
        step.addEventListener("click", () => changeStory(step.dataset.story));
    });

    if (journeySteps.length > 0) {
        let currentStory = 0;

        setInterval(() => {
            if (!historySection || !historySection.classList.contains("show")) {
                return;
            }

            currentStory = (currentStory + 1) % journeySteps.length;
            changeStory(journeySteps[currentStory].dataset.story);
        }, 3500);
    }

    const historyToggle = document.querySelector(".history-toggle");

    if (historyToggle && historySection) {
        historyToggle.addEventListener("click", () => {
            const isExpanded = historySection.classList.toggle("expanded");

            historyToggle.setAttribute("aria-expanded", isExpanded);
            historyToggle.firstChild.textContent = isExpanded ? " Recolher história " : " Ler história completa ";
        });
    }

    /* FUNÇÃO ANIMAÇÃO FALE CONOSCO */
    const contactSection = document.querySelector(".sixth");

    if (contactSection) {
        const showContactSection = () => {
            contactSection.classList.add("show");
        };

        const hideContactSection = () => {
            contactSection.classList.remove("show");
        };

        if ("IntersectionObserver" in window) {
            const contactObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        showContactSection();
                    } else {
                        hideContactSection();
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: "0px 0px -10% 0px"
            });

            contactObserver.observe(contactSection);
        } else {
            showContactSection();
        }
    }

    /* FUNÇÃO ANIMAÇÃO DOS CARDS */
    const cardsPacotes = document.querySelectorAll(".pacotes");

    cardsPacotes.forEach(card => {
        card.addEventListener("pointermove", function(e) {
            if (e.pointerType === "touch") {
                return;
            }

            const cardPosition = card.getBoundingClientRect();
            const x = e.clientX - cardPosition.left;
            const y = e.clientY - cardPosition.top;
            const centerX = cardPosition.width / 2;
            const centerY = cardPosition.height / 2;

            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
            card.style.setProperty("--rotate-x", `${rotateX}deg`);
            card.style.setProperty("--rotate-y", `${rotateY}deg`);
        });

        card.addEventListener("pointerleave", function() {
            card.style.setProperty("--mouse-x", "50%");
            card.style.setProperty("--mouse-y", "50%");
            card.style.setProperty("--rotate-x", "0deg");
            card.style.setProperty("--rotate-y", "0deg");
        });
    });


    /* FUNÇÃO CONTATO ALEATÓRIO */
    const cadastroForm = document.querySelector(".cadastro");
    const cadastroNomeInput = document.getElementById("cadastro-email");
    const cadastroNumeroInput = document.getElementById("cadastro-numero");
    const cadastroError = document.getElementById("cadastro-error");
    const whatsappAutoescola = "5519989132598";
    const botoes = document.querySelectorAll("#botao, #botao-menu, .whatsapp-btn");

    if (cadastroForm) {
        cadastroForm.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    }

    const limparErroCadastro = () => {
        if (cadastroError) {
            cadastroError.textContent = "";
        }

        cadastroNomeInput?.classList.remove("input-error");
        cadastroNumeroInput?.classList.remove("input-error");
        cadastroNomeInput?.removeAttribute("aria-invalid");
        cadastroNumeroInput?.removeAttribute("aria-invalid");
    };

    const mostrarErroCadastro = (mensagem, campo) => {
        if (cadastroError) {
            cadastroError.textContent = mensagem;
        }

        campo?.classList.add("input-error");
        campo?.setAttribute("aria-invalid", "true");
        campo?.focus();
    };

    const formatarTelefoneWhatsApp = (telefone) => {
        let digitos = telefone.replace(/\D/g, "");

        if (digitos.startsWith("55")) {
            digitos = digitos.slice(2);
        }

        const temDdd = digitos.length === 10 || digitos.length === 11;
        const dddValido = temDdd && Number(digitos.slice(0, 2)) >= 11;

        if (!temDdd || !dddValido) {
            return null;
        }

        return `55${digitos}`;
    };

    cadastroNomeInput?.addEventListener("input", limparErroCadastro);
    cadastroNumeroInput?.addEventListener("input", limparErroCadastro);

    const abrirWhatsAppAutoescola = (mensagem) => {
        const url = `https://wa.me/${whatsappAutoescola}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");
    };

    const mensagensPacotes = {
        "a-b": "Olá, vim do site e gostaria de mais informações sobre minha CNH CATEGORIA A/B.",
        "a": "Olá, vim do site e gostaria de mais informações sobre minha CNH CATEGORIA A.",
        "b": "Olá, vim do site e gostaria de mais informações sobre minha CNH CATEGORIA B.",
        "d": "Olá, vim do site e gostaria de mais informações sobre minha CNH CATEGORIA D.",
        "more_class": "Olá, vim do site e gostaria de mais informações sobre aulas para recém habilitados.",
        "reciclagem": "Olá, vim do site e gostaria de mais informações sobre reciclagem da CNH."
    };

    document.querySelectorAll(".pacotes .cat").forEach(botaoPacote => {
        botaoPacote.addEventListener("click", function(e) {
            e.preventDefault();

            const pacote = botaoPacote.closest(".pacotes");
            const mensagem = mensagensPacotes[pacote?.id] || "Olá, vim do site e gostaria de mais informações.";

            abrirWhatsAppAutoescola(mensagem);
        });
    });

    botoes.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();

            let mensagem = "Olá, vim pelo site e gostaria de mais informações sobre adquirir a minha CNH!";

            if (btn.classList.contains("signup-submit")) {
                limparErroCadastro();

                const nome = cadastroNomeInput?.value.trim() || "";
                const numero = cadastroNumeroInput?.value.trim() || "";
                const telefoneFormatado = formatarTelefoneWhatsApp(numero);

                if (nome.length < 2) {
                    mostrarErroCadastro("Informe seu nome para continuar.", cadastroNomeInput);
                    return;
                }

                if (!telefoneFormatado) {
                    mostrarErroCadastro("Informe um WhatsApp válido com DDD. Ex: (19) 99999-9999.", cadastroNumeroInput);
                    return;
                }

                mensagem = `Olá, vim pelo site e gostaria de saber mais sobre a minha matrícula. Meu nome é ${nome}.`;
            }

            abrirWhatsAppAutoescola(mensagem);
        });
    });
});
