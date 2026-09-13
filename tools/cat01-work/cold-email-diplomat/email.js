// 글로벌 비즈니스 영문 메일 생성기 로직
document.addEventListener('DOMContentLoaded', () => {
    const scenarioSelect = document.getElementById('scenario-select');
    const recipientName = document.getElementById('recipient-name');
    const projectName = document.getElementById('project-name');
    const toneSlider = document.getElementById('tone-slider');
    const levelDisplay = document.getElementById('level-display');
    const emailSubject = document.getElementById('email-subject');
    const emailBody = document.getElementById('email-body');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');

    const templates = {
        followup: {
            subject: 'Following up: {PROJECT}',
            1: `Hi {NAME},\n\nI hope you are having a wonderful week.\n\nI wanted to kindly check in regarding the {PROJECT} we discussed last week. Please let me know if you need any additional materials or have any questions.\n\nWarm regards,\n[Your Name]`,
            2: `Dear {NAME},\n\nI am following up on our previous conversation regarding the {PROJECT}.\n\nCould you please share a quick status update on your end so we can align our next steps accordingly?\n\nBest regards,\n[Your Name]`,
            3: `Hi {NAME},\n\nI am writing to request an urgent update on {PROJECT}.\n\nOur project timeline is currently paused pending your confirmation. Kindly review and get back to us by the end of the day (EOD).\n\nSincerely,\n[Your Name]`,
            4: `Dear {NAME},\n\nPer my last email dated earlier this week, we are still waiting for your deliverables regarding {PROJECT}.\n\nAs previously highlighted, missing this deadline directly impacts the launch schedule. Please review the attached thread and confirm immediately.\n\nRegards,\n[Your Name]`
        },
        rejection: {
            subject: 'Regarding {PROJECT} proposal',
            1: `Dear {NAME},\n\nThank you so much for the thoughtful proposal on {PROJECT}.\n\nWhile we truly appreciate your effort, we have decided to go in a different direction at this time. We would love to stay in touch for future opportunities.\n\nWarmly,\n[Your Name]`,
            2: `Hi {NAME},\n\nThank you for presenting the {PROJECT} proposal to our team.\n\nAfter thorough internal review, we regret to inform you that we are unable to move forward with this project under current strategic priorities.\n\nBest regards,\n[Your Name]`,
            3: `Dear {NAME},\n\nFollowing up on {PROJECT}, we have concluded that this initiative does not align with our current quarterly roadmap and budget constraints. We must decline at this stage.\n\nSincerely,\n[Your Name]`,
            4: `Dear {NAME},\n\nAs discussed in our prior correspondence, {PROJECT} falls strictly outside our agreed scope and technical capacity. We will not be proceeding with any further discussions on this matter.\n\nRegards,\n[Your Name]`
        },
        delay: {
            subject: 'Timeline adjustment notice: {PROJECT}',
            1: `Hi {NAME},\n\nI hope all is well with you.\n\nWe are making great progress on {PROJECT}. To ensure the highest quality standards, we would love to take an extra 2 days to finalize testing. Thank you for your kind understanding!\n\nWarm regards,\n[Your Name]`,
            2: `Dear {NAME},\n\nI am writing to inform you of a slight adjustment to the {PROJECT} delivery milestone.\n\nDue to unexpected integration dependencies, we anticipate delivering the finalized package by early next week. Thank you for your flexibility.\n\nBest regards,\n[Your Name]`,
            3: `Hi {NAME},\n\nPlease note that the delivery date for {PROJECT} must be deferred by one week due to critical technical blockers. We are allocating all available resources to resolve this swiftly.\n\nSincerely,\n[Your Name]`,
            4: `Dear {NAME},\n\nDue to critical unfulfilled prerequisites from the upstream team regarding {PROJECT}, the previously agreed deadline is no longer viable. We will establish a revised schedule once blockers are cleared.\n\nRegards,\n[Your Name]`
        },
        intro: {
            subject: 'Strategic partnership opportunity: {PROJECT}',
            1: `Hi {NAME},\n\nI have been following your incredible work at your company and wanted to reach out.\n\nWe have developed {PROJECT} which could bring substantial synergy to your current workflow. Would love to buy you a virtual coffee if your schedule allows!\n\nWarm regards,\n[Your Name]`,
            2: `Dear {NAME},\n\nI am reaching out regarding a potential collaboration around {PROJECT}.\n\nOur platform helps teams achieve 35% higher productivity in this domain. Would you be open to a brief 10-minute introductory call this Thursday?\n\nBest regards,\n[Your Name]`,
            3: `Hi {NAME},\n\nGiven your leadership role, I am writing directly to propose {PROJECT}.\n\nWe solve the core operational bottlenecks your team is likely facing. Are you available for a concise 15-minute demo next Tuesday at 2 PM?\n\nSincerely,\n[Your Name]`,
            4: `Dear {NAME},\n\nI am reaching out because {PROJECT} directly addresses the exact scaling challenge your organization is experiencing. Let me know if you have 10 minutes to review the ROI breakdown before end of quarter.\n\nRegards,\n[Your Name]`
        }
    };

    function renderEmail() {
        const scenario = scenarioSelect.value;
        const tone = toneSlider.value;
        const name = recipientName.value.trim() || 'Partner';
        const project = projectName.value.trim() || 'the initiative';

        const toneNames = {
            1: 'Lv 1: Polite & Warm',
            2: 'Lv 2: Standard Business',
            3: 'Lv 3: Firm & Direct',
            4: 'Lv 4: "Per My Last Email"'
        };
        levelDisplay.textContent = toneNames[tone];

        const rawSubj = templates[scenario].subject;
        const rawBody = templates[scenario][tone];

        emailSubject.textContent = rawSubj.replace(/{PROJECT}/g, project);
        emailBody.value = rawBody.replace(/{NAME}/g, name).replace(/{PROJECT}/g, project);
    }

    [scenarioSelect, recipientName, projectName, toneSlider].forEach(el => {
        el.addEventListener('input', renderEmail);
    });

    copyEmailBtn.addEventListener('click', () => {
        const full = `Subject: ${emailSubject.textContent}\n\n${emailBody.value}`;
        navigator.clipboard.writeText(full).then(() => {
            copyEmailText.textContent = '복사 완료!';
            setTimeout(() => copyEmailText.textContent = '메일 복사', 1500);
        });
    });

    renderEmail();
});
