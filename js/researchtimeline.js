// Define research projects
const projects = [
    {
        id: 1,
        title: "Popular Music Education",
        startDate: new Date(2011, 0, 1), // Jan 1, 2011
        endDate: new Date(2014, 11, 31),  // Dec 31, 2014
        description: "",
        color: "#4a6fa5"
    },
    {
        id: 2,
        title: "The Electric Guitar",
        startDate: new Date(2014, 0, 1), // Jan 1, 2014
        endDate: new Date(2024, 11, 31),  // Dec 31, 2024
        description: "",
        color: "#e28743"
    },
    {
        id: 3,
        title: "German Heavy Metal",
        startDate: new Date(2017, 0, 1), // Jan 1, 2017
        endDate: new Date(2022, 11, 31),  // Dec 31, 2022
        description: "",
        color: "#76a56f"
    },
    {
        id: 4,
        title: "Gear Acquisition Syndrome",
        startDate: new Date(2018, 0, 1), // Jan 1, 2018
        endDate: new Date(2021, 11, 31), // Dec 31, 2021
        description: "",
        color: "#9c6fb0"
    },
    {
        id: 5,
        title: "Heaviness in Metal Music Production",
        startDate: new Date(2020, 0, 1), // Jan 1, 2020
        endDate: null, // Ongoing
        description: "",
        color: "#d16666"
    },
    {
        id: 6,
        title: "Web 3 and AI in Music",
        startDate: new Date(2022, 0, 1), // Jan 1, 2022
        endDate: null, // Ongoing
        description: "",
        color: "#3ca3a3"
    },
    {
        id: 7,
        title: "Songwriting Camps in the 21st Century",
        startDate: new Date(2023, 0, 1), // Jan 1, 2023
        endDate: null, // Ongoing
        description: "",
        color: "#c98f30"
    }
];

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTimeline();
});

function initializeTimeline() {
    // Canvas setup
    const canvas = document.getElementById('timelineCanvas');
    if (!canvas) return; // Exit if canvas element doesn't exist
    
    const ctx = canvas.getContext('2d');
    const legendContainer = document.getElementById('legendItems');

    // Initialize with a slight negative offset to ensure all projects are visible
    let scale = 1;
    let offsetX = -50; // Start with a slight left offset to show more recent projects better
    
    // Calculate earliest and latest dates from projects
    const minDate = new Date(Math.min(...projects.map(p => p.startDate.getTime())));
    // For max date, account for ongoing projects
    const now = new Date();
    const maxDate = new Date(Math.max(...projects.map(p => p.endDate ? p.endDate.getTime() : now.getTime())));
    
    // Add some padding (6 months) to the date range for better visualization
    minDate.setMonth(minDate.getMonth() - 6);
    maxDate.setMonth(maxDate.getMonth() + 6);
    
    // Initial setup
    createLegend();
    drawTimeline();

    // Add event listeners for controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const panLeftBtn = document.getElementById('panLeft');
    const panRightBtn = document.getElementById('panRight');
    const resetBtn = document.getElementById('reset');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            scale = Math.min(3, scale * 1.2); // Limit maximum zoom
            drawTimeline();
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            scale = Math.max(0.5, scale / 1.2); // Limit minimum zoom
            drawTimeline();
        });
    }
    
    if (panLeftBtn) {
        panLeftBtn.addEventListener('click', () => {
            offsetX -= 100 / scale; // Adjust pan amount based on zoom level
            drawTimeline();
        });
    }
    
    if (panRightBtn) {
        panRightBtn.addEventListener('click', () => {
            offsetX += 100 / scale; // Adjust pan amount based on zoom level
            drawTimeline();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            scale = 1;
            offsetX = -50; // Reset to the initial offset that shows all projects
            drawTimeline();
        });
    }

    // Canvas interaction for hover effects
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let isOverProject = false;
        
        // Check if mouse is over a project bar
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            const projectY = 80 + i * 70; // Match the new spacing in drawTimeline
            
            if (y >= projectY && y <= projectY + 40) {
                // Calculate project's position on the timeline
                const projectStartX = getXPosition(project.startDate);
                const projectEndX = project.endDate ? getXPosition(project.endDate) : getXPosition(new Date());
                
                if (x >= projectStartX && x <= projectEndX) {
                    canvas.style.cursor = 'pointer';
                    isOverProject = true;
                    break;
                }
            }
        }
        
        if (!isOverProject) {
            canvas.style.cursor = 'default';
        }
    });

    function getXPosition(date) {
        const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
        const daysFromStart = (date - minDate) / (1000 * 60 * 60 * 24);
        const pixelsPerDay = (canvas.width - 100) / totalDays;
        
        // Apply scale and offset while ensuring the result stays within reasonable bounds
        return Math.min(Math.max(50, 50 + (daysFromStart * pixelsPerDay * scale) + offsetX), canvas.width - 50);
    }

    function drawTimeline() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw timeline axis
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(canvas.width - 50, 50);
        ctx.stroke();
        
        // Draw year markers
        const startYear = minDate.getFullYear();
        const endYear = maxDate.getFullYear() + 1;
        
        for (let year = startYear; year <= endYear; year++) {
            const yearDate = new Date(year, 0, 1);
            const x = getXPosition(yearDate);
            
            if (x >= 50 && x <= canvas.width - 50) {
                ctx.beginPath();
                ctx.moveTo(x, 45);
                ctx.lineTo(x, 55);
                ctx.stroke();
                
                ctx.fillStyle = "#333";
                ctx.textAlign = "center";
                ctx.fillText(year, x, 40);
            }
            
            // Draw mid-year markers
            const midYearDate = new Date(year, 6, 1);
            const midX = getXPosition(midYearDate);
            
            if (midX >= 50 && midX <= canvas.width - 50) {
                ctx.beginPath();
                ctx.moveTo(midX, 47);
                ctx.lineTo(midX, 53);
                ctx.stroke();
            }
        }
        
        // Draw projects
        projects.forEach((project, index) => {
            const y = 80 + index * 70; // Increased vertical spacing between projects
            let startX = getXPosition(project.startDate);
            let endX = project.endDate ? getXPosition(project.endDate) : getXPosition(new Date());
            
            // Ensure minimum width for very short or zero-width bars
            if (endX - startX < 5) {
                endX = startX + 5;
            }
            
            // Draw project bar
            ctx.fillStyle = project.color;
            ctx.fillRect(startX, y, endX - startX, 40);
            
            // Add project title with text wrapping if needed
            const title = project.title;
            const barWidth = endX - startX;
            
            // Measure text width for positioning
            ctx.font = "bold 12px Georgia";
            const textWidth = ctx.measureText(title).width;
            const textHeight = 15; // Approximate height of text
            
            // Determine text position - always start at beginning of bar if possible
            let textX, textY;
            let textColor;
            
            // Default: place text at the beginning of the bar
            // Increased padding to 15px to prevent truncation
            textX = startX + 15;
            textY = y + 24;
            textColor = "#fff";
            
            // Only if the bar is extremely narrow (less than 40px), place text above
            if (barWidth < 40) {
                textX = Math.max(50, startX);
                textY = y - 10;
                textColor = "#333";
            }
            
            // Save the current context state
            ctx.save();
            
            // Explicitly set text alignment to left
            ctx.textAlign = "left";
            
            // Draw text with background for better readability
            if (textColor === "#333") {
                // For dark text, add a semi-transparent white background
                // Add extra padding to ensure text isn't cut off
                ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
                ctx.fillRect(textX - 3, textY - textHeight + 2, textWidth + 6, textHeight + 4);
            }
            
            // Draw text
            ctx.fillStyle = textColor;
            ctx.fillText(title, textX, textY);
            
            // Restore the context state
            ctx.restore();
            
            // Add start and end dates with better positioning
            ctx.font = "10px Georgia";
            
            const startDateText = formatDate(project.startDate);
            const endDateText = project.endDate ? formatDate(project.endDate) : "Ongoing";
            
            const startDateWidth = ctx.measureText(startDateText).width;
            const endDateWidth = ctx.measureText(endDateText).width;
            
            // Save context state for dates
            ctx.save();
            
            // Position dates with better spacing
            // Start date - ensure it's always visible and not cut off
            const startDateX = Math.max(50, startX - startDateWidth/2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.fillRect(startDateX - 3, y - 15, startDateWidth + 6, 12);
            
            ctx.fillStyle = "#333";
            ctx.textAlign = "center"; // Center alignment for dates
            ctx.fillText(startDateText, startDateX, y - 5);
            
            // End date - position it properly for visibility
            const endDateX = Math.min(canvas.width - 50, endX - endDateWidth/2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.fillRect(endDateX - 3, y - 15, endDateWidth + 6, 12);
            
            ctx.fillStyle = "#333";
            ctx.fillText(endDateText, endDateX, y - 5);
            
            // Restore context state
            ctx.restore();
        });
    }

    function createLegend() {
        if (!legendContainer) return;
        
        let legendHTML = '';
        
        projects.forEach(project => {
            legendHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <div style="width: 20px; height: 20px; background-color: ${project.color}; margin-right: 10px;"></div>
                    <span>${project.title}</span>
                </div>
            `;
        });
        
        legendContainer.innerHTML = legendHTML;
    }

    function formatDate(date) {
        // Return only the year, no month
        return date.getFullYear().toString();
    }

    // Handle window resize to make the timeline responsive
    window.addEventListener('resize', function() {
        // Adjust canvas size if needed
        drawTimeline();
    });
}
