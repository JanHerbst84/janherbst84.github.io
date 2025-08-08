document.addEventListener('DOMContentLoaded', function() {
    // Data from the original researchtimeline.js
    const projectsData = [
        {
            id: 1,
            title: "Popular Music Education",
            startDate: new Date(2011, 0, 1), // Jan 1, 2011
            endDate: new Date(2014, 11, 31),  // Dec 31, 2014
            description: "PhD project on music production in popular music genres from historical, technical, aesthetic and educational viewpoints.",
            color: "#4a6fa5"
        },
        {
            id: 2,
            title: "The Electric Guitar",
            startDate: new Date(2014, 0, 1), // Jan 1, 2014
            endDate: new Date(2024, 11, 31),  // Dec 31, 2024 (Assuming this was the intended end for the general focus)
            description: "Research on the musical and cultural relevance of the electric guitar, including distortion, playing techniques, and technology.",
            color: "#e28743"
        },
        {
            id: 3,
            title: "German Heavy Metal",
            startDate: new Date(2017, 0, 1), // Jan 1, 2017
            endDate: new Date(2022, 11, 31),  // Dec 31, 2022
            description: "Investigation into the history, sound, key figures, and cultural impact of German heavy metal.",
            color: "#76a56f"
        },
        {
            id: 4,
            title: "Gear Acquisition Syndrome",
            startDate: new Date(2018, 0, 1), // Jan 1, 2018
            endDate: new Date(2021, 11, 31), // Dec 31, 2021
            description: "Exploration of 'GAS', the musician's urge to buy gear, and its relation to creativity and cultural discourse.",
            color: "#9c6fb0"
        },
        {
            id: 5,
            title: "Heaviness in Metal Music Production (HiMMP)",
            startDate: new Date(2020, 0, 1), // Jan 1, 2020
            endDate: new Date(2024, 0, 31), // AHRC project 2020-2024
            description: "AHRC-funded project exploring how heaviness is created and controlled in metal music production.",
            color: "#d16666"
        },
        {
            id: 6,
            title: "Web 3 and AI in Music",
            startDate: new Date(2022, 0, 1), // Jan 1, 2022
            endDate: null, // Ongoing
            description: "Research on the impact of Web 3 technologies (blockchain, NFTs) and AI on the music industry and creation.",
            color: "#3ca3a3"
        },
        {
            id: 7,
            title: "Songwriting Camps in the 21st Century (SC21)",
            startDate: new Date(2023, 0, 1), // Jan 1, 2023
            endDate: new Date(2026, 0, 31), // AHRC/DFG project 2023-2026
            description: "AHRC/DFG funded project researching collaborative songwriting in contemporary songwriting camps.",
            color: "#c98f30"
        },
        {
            id: 8,
            title: "Extreme Metal Vocals (EMV)",
            startDate: new Date(2022, 8, 1), // Assuming Sep 1, 2022 based on 2022-2025
            endDate: new Date(2025, 7, 31),   // Assuming Aug 31, 2025
            description: "ERC-funded project on musical expression, technique, and cultural meaning of extreme metal vocals.",
            color: "#5e8b7e" // New color
        },
        {
            id: 9,
            title: "Women's Electric Guitar Practice (WEG)",
            startDate: new Date(2022, 4, 1), // Assuming May 1, 2022 based on 2022-2024
            endDate: new Date(2024, 3, 30),   // Assuming Apr 30, 2024
            description: "ERC-funded project on the impact of digitization and online spaces on women's electric guitar practice.",
            color: "#a26769" // New color
        }
    ];

    // Transform data for Vis.js Timeline
    const items = new vis.DataSet(projectsData.map(project => {
        const item = {
            id: project.id,
            content: project.title,
            start: project.startDate,
            style: `background-color: ${project.color}; color: white; border-color: ${project.color};` // Custom style for item color
        };
        if (project.endDate) {
            item.end = project.endDate;
            item.type = 'range';
        } else {
            // For ongoing projects, make them a point or a range ending "now"
            // For simplicity, let's make them a range ending today, Vis.js will handle future if needed
            item.end = new Date(); 
            item.type = 'range';
             // Or, to make it visually distinct as ongoing:
            // item.type = 'point'; // or handle styling for ongoing ranges
        }
        // Add description to title for tooltip
        if (project.description) {
            item.title = project.description;
        }
        return item;
    }));

    // DOM element where the Timeline will be attached
    const container = document.getElementById('interactiveTimeline');
    if (!container) {
        console.error('Timeline container not found');
        return;
    }

    // Configuration for the Timeline
    const options = {
        // Basic options
        width: '100%',
        height: '550px', // Adjusted height slightly
        margin: {
            item: 20, // Can be an object {horizontal: number, vertical: number}
            axis: 20
        },
        stack: true, // Stack items vertically if they overlap in time
        orientation: 'top', // Time axis on top
        
        // Time axis options
        min: new Date(2010, 0, 1), // Overall start date for the timeline view
        max: new Date(2027, 0, 1), // Overall end date for the timeline view
        zoomMin: 1000 * 60 * 60 * 24 * 30 * 6, // Minimum zoom level (e.g., 6 months)
        zoomMax: 1000 * 60 * 60 * 24 * 365 * 20, // Maximum zoom level (e.g., 20 years)
        
        // Item options
        editable: false, // Prevent moving/editing items
        showCurrentTime: true, // Show a line for the current time
        
        // Styling
        groupOrder: 'content', // Order groups by content

        // Tooltip configuration
        tooltip: {
            followMouse: true,
            overflowMethod: 'flip'
        },
        
        // Template for items (optional, for more complex HTML in items)
        // template: function (item, element, data) {
        //   return `<div>${item.content}</div>`;
        // }
    };

    // Create a Timeline
    const timeline = new vis.Timeline(container, items, options);

    // Optional: Add legend dynamically if needed, or keep static HTML legend
    // The old legend code from researchtimeline.js could be adapted if a dynamic JS legend is preferred.
    // For now, the colors are directly on the items.
});
