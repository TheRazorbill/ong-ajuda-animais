document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        const sections = document.querySelectorAll('.form-section');
        const steps = document.querySelectorAll('.step-indicator');
        let currentSection = 1;

        // Inicializa as máscaras de input
        const cpfMask = IMask(document.getElementById('cpf'), { mask: '000.000.000-00' });
        const phoneMask = IMask(document.getElementById('phone'), { mask: '(00) 00000-0000' });
        const cepMask = IMask(document.getElementById('cep'), { mask: '00000-000' });

        const updateUI = () => {
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`section${currentSection}`).classList.add('active');

            steps.forEach((step, index) => {
                const stepNum = index + 1;
                step.classList.remove('active', 'completed');
                if (stepNum < currentSection) {
                    step.classList.add('completed');
                } else if (stepNum === currentSection) {
                    step.classList.add('active');
                }
            });
        };

        registrationForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-btn')) {
                // Validação será adicionada depois
                currentSection++;
                updateUI();
            } else if (e.target.classList.contains('prev-btn')) {
                currentSection--;
                updateUI();
            }
        });

        updateUI();
    }
});