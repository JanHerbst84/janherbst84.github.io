class PublicationFilter {
    constructor(publications, topicMap) {
        this.publicationsData = publications;
        this.topicMap = topicMap;
        this.publicationsGrid = document.getElementById('publicationsGrid');
        this.searchBox = document.getElementById('searchBox');
        this.filterButtons = document.getElementById('filterButtons');
        this.publicationCount = document.getElementById('publicationCount');
        this.noResults = document.getElementById('noResults');
        this.activeFilters = new Set();
        
        // Add error handling for missing DOM elements
        if (!this.publicationsGrid || !this.searchBox || !this.filterButtons || !this.publicationCount || !this.noResults) {
            console.error('Required DOM elements not found');
            return;
        }
        
        this.init();
    }

    init() {
        this.renderPublications(this.publicationsData);
        // Query publications after they've been rendered to the DOM
        this.publications = document.querySelectorAll('.publication-item');
        this.generateFilterButtons();
        this.bindEvents();
        this.updateDisplay();
    }

    renderPublications(publications) {
        this.publicationsGrid.innerHTML = '';
        publications.forEach(pub => {
            const publicationItem = document.createElement('div');
            publicationItem.className = 'publication-item';
            publicationItem.dataset.keywords = pub.keywords;

            let linksHTML = '<div class="article-links">';
            if (pub.links.read) {
                linksHTML += `<a href="${pub.links.read}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Read Article</a>`;
            }
            if (pub.links.summary) {
                linksHTML += `<a href="${pub.links.summary}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View Summary</a>`;
            }
            if (pub.links.openAccess) {
                linksHTML += `<a href="${pub.links.openAccess}" target="_blank" class="btn btn-secondary">(open access)</a>`;
            }
            if (pub.links.publisher) {
                linksHTML += `<a href="${pub.links.publisher}" target="_blank" class="btn btn-primary">Publisher</a>`;
            }
            if (pub.links.website) {
                linksHTML += `<a href="${pub.links.website}" target="_blank" class="btn btn-secondary">Website</a>`;
            }
            if (pub.links.doi) {
                linksHTML += `<a href="${pub.links.doi}" target="_blank" class="btn btn-secondary">DOI</a>`;
            }
            if (pub.links.download) {
                linksHTML += `<a href="${pub.links.download}" target="_blank" class="btn btn-secondary">Download</a>`;
            }
            linksHTML += '</div>';

            const venueHTML = pub.journal ? `<div class="pub-venue">${pub.journal}</div>` : (pub.publisher ? `<div class="pub-venue">${pub.publisher}</div>` : `<div class="pub-venue">${pub.booktitle}</div>`);

            publicationItem.innerHTML = `
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                ${venueHTML}
                <div class="pub-year">${pub.year}</div>
                ${linksHTML}
                <div class="pub-topics">
                    ${pub.topics.split(',').map(topic => `<span class="topic-tag">${this.formatTopicName(topic)}</span>`).join('')}
                </div>
            `;
            this.publicationsGrid.appendChild(publicationItem);
        });
    }

    generateFilterButtons() {
        const mainTopics = Object.keys(this.topicMap).sort();
        
        this.filterButtons.innerHTML = '';
        
        const clearButton = document.createElement('button');
        clearButton.className = 'filter-btn clear-filters';
        clearButton.textContent = 'Clear All';
        clearButton.onclick = () => this.clearAllFilters();
        
        mainTopics.forEach(topic => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = topic;
            button.dataset.topic = topic;
            button.onclick = () => this.toggleFilter(topic);
            this.filterButtons.appendChild(button);
        });
        
        this.filterButtons.appendChild(clearButton);
    }

    formatTopicName(topic) {
        return topic.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    bindEvents() {
        // Add debounced search to improve performance
        let searchTimeout;
        this.searchBox.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.updateDisplay();
            }, 300); // 300ms delay
        });
    }

    toggleFilter(topic) {
        const button = document.querySelector(`[data-topic="${topic}"]`);
        
        if (this.activeFilters.has(topic)) {
            this.activeFilters.delete(topic);
            button.classList.remove('active');
        } else {
            this.activeFilters.add(topic);
            button.classList.add('active');
        }
        
        this.updateDisplay();
    }

    clearAllFilters() {
        this.activeFilters.clear();
        this.searchBox.value = '';
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.updateDisplay();
    }

    updateDisplay() {
        const searchTerm = this.searchBox.value.toLowerCase();
        let visibleCount = 0;

        this.publications.forEach(pub => {
            const shouldShow = this.shouldShowPublication(pub, searchTerm);
            pub.classList.toggle('hidden', !shouldShow);
            if (shouldShow) visibleCount++;
        });

        this.updateCount(visibleCount);
        this.noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    shouldShowPublication(pub, searchTerm) {
        // Check search term
        if (searchTerm) {
            const title = pub.querySelector('.pub-title').textContent.toLowerCase();
            const authors = pub.querySelector('.pub-authors').textContent.toLowerCase();
            const venue = pub.querySelector('.pub-venue').textContent.toLowerCase();
            
            if (!title.includes(searchTerm) && !authors.includes(searchTerm) && !venue.includes(searchTerm)) {
                return false;
            }
        }

        // Check topic filters - use OR logic (any filter can match)
        if (this.activeFilters.size > 0) {
            const pubKeywords = new Set(pub.dataset.keywords.split(',').map(t => t.trim()));
            let hasAnyMatch = false;
            
            for (const activeFilter of this.activeFilters) {
                const subKeywords = this.topicMap[activeFilter] || [];
                const hasMatchingKeyword = subKeywords.some(subKeyword => pubKeywords.has(subKeyword));
                if (hasMatchingKeyword) {
                    hasAnyMatch = true;
                    break; // Found a match, no need to check other filters
                }
            }
            
            if (!hasAnyMatch) {
                return false;
            }
        }

        return true;
    }

    updateCount(count) {
        const total = this.publications.length;
        this.publicationCount.textContent = `Showing ${count} of ${total} publications`;
    }
}

// Initialize the filter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const publications = [
        // 2025 Articles
        {
            "year": "2025",
            "authors": "(with Mark Mynett)",
            "title": "Metal Music and the Aesthetics of Heaviness: Sonic, Structural, and Affective Perspectives.",
            "journal": "Rock Music Studies (forthcoming).",
            "links": {},
            "type": "article",
            "topics": "Heaviness,Aesthetics & Creativity,Metal Studies,Music Production,Research Methods",
            "keywords": "heaviness,aesthetics,metal,music-production,qualitative-research,musical-expression"
        },
        {
            "year": "2025",
            "authors": "(with Eric Smialek)",
            "title": "\"Mixed\" Results: An Introduction to Analyzing Metal Production through Eight Commissioned Metal Mixes.",
            "journal": "Zeitschrift der Gesellschaft für Musiktheorie (Journal of the German-Speaking Society of Music Theory), 22(1).",
            "links": { "read": "https://doi.org/10.31751/1222", "summary": "https://www.growkudos.com/profile/jan_herbst/publications" },
            "type": "article",
            "topics": "Music Production,Metal Studies,Music Theory & Analysis,Music Psychology & Perception,Aesthetics & Creativity",
            "keywords": "music-production,metal,music-analysis,psychoacoustics,aesthetics,sound-engineering"
        },
        {
            "year": "2025",
            "authors": "(with Mark Mynett)",
            "title": "Aesthetic Tensions in Metal Production: Genre Expectations, Technological Mediation, and Creative Freedom.",
            "journal": "Popular Music & Society, 49(1).",
            "links": { "read": "https://doi.org/10.1080/03007766.2025.2530807", "summary": "https://www.growkudos.com/publications/10.1080%25252F03007766.2025.2530807/reader" },
            "type": "article",
            "topics": "Aesthetics & Creativity,Music Production,Metal Studies,Fandom, Identity & Subculture,Music, Culture & Society,Research Methods",
            "keywords": "aesthetics,music-production,metal,authenticity,cultural-studies,netnography"
        },
        {
            "year": "2025",
            "authors": "(with Eric Smialek)",
            "title": "Towards an Analytical Methodology for Vocalist's Live Gestures in Extreme Metal.",
            "journal": "Samples, 22, pp. 1–26.",
            "links": { "read": "https://gfpm-samples.de/index.php/samples/article/view/341/324" },
            "type": "article",
            "topics": "Metal Studies,Performance & Live Music,Research Methods,Music Theory & Analysis",
            "keywords": "metal,live-performance,vocals,research-methods,music-analysis"
        },
        {
            "year": "2025",
            "authors": "(with Ruth Barratt-Peacock)",
            "title": "The Effects of Ensemble Singing on Heaviness in Metal Music: Revisiting a Systematic Approach.",
            "journal": "Metal Music Studies, 11(1), pp. 65–89.",
            "links": { "read": "https://doi.org/10.1386/mms_00166_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00166_1/reader" },
            "type": "article",
            "topics": "Heaviness,Metal Studies,Performance & Live Music,Music Psychology & Perception",
            "keywords": "heaviness,metal,vocals,performance,music-psychology"
        },
        
        // 2024 Articles
        {
            "year": "2024",
            "authors": "(with Marian Lux)",
            "title": "From Analogue to Algorithm: How Private Production Reshaped Metal Aesthetics.",
            "journal": "Metal Music Studies, 10(3), pp. 249–274.",
            "links": { "read": "https://doi.org/10.1386/mms_00137_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00137_1/reader" },
            "type": "article",
            "topics": "Music Production,Metal Studies,Music Technology,Aesthetics & Creativity",
            "keywords": "music-production,metal,technology,digital-music,aesthetics"
        },
        {
            "year": "2024",
            "authors": "(with Katherine Williams, Ingrid M. Tolstad & Simon Barber)",
            "title": "The Benefits of Collaborative Popular Music Songwriting: A Spectrum of Artist-Songwriter Involvement.",
            "journal": "Popular Music and Society, 48(1), pp. 1–24.",
            "links": { "read": "https://doi.org/10.1080/03007766.2024.2428035", "summary": "https://www.growkudos.com/publications/10.1080%25252F03007766.2024.2428035/reader" },
            "type": "article",
            "topics": "Songwriting & Collaboration,Popular Music Studies,Music Industry & Labor",
            "keywords": "songwriting,collaboration,popular-music,music-industry"
        },
        {
            "year": "2024",
            "authors": "(with Michael Ahlers)",
            "title": "Songwriting Camps: Geschichte, Theorien und Forschungsansätze zur Fließband-Produktion von populärer Musik.",
            "journal": "~Vibes (journal of IASPM D-A-CH), 3.",
            "links": { "read": "https://vibes-theseries.org/songwriting-camps" },
            "type": "article",
            "topics": "Songwriting & Collaboration,Music Industry & Labor,Popular Music Studies",
            "keywords": "songwriting-camps,music-industry,collaboration,popular-music"
        },
        {
            "year": "2024",
            "authors": "(with Michael Ahlers & Simon Barber)",
            "title": "\"The Song Factories Have Closed!\": Songwriting Camps as Spaces of Collaborative Creativity in the Post-Industrial Age.",
            "journal": "Creative Industries Journal, pp. 1–22.",
            "links": { "read": "https://doi.org/10.1080/17510694.2024.2366163", "summary": "https://www.growkudos.com/publications/10.1080%25252F17510694.2024.2366163/reader" },
            "type": "article",
            "topics": "Songwriting & Collaboration,Music Industry & Labor,Aesthetics & Creativity",
            "keywords": "songwriting-camps,creative-industries,post-industrialism,collaboration"
        },

        // 2023 Articles
        {
            "year": "2023",
            "authors": "(with Mark Mynett)",
            "title": "Lorna Shore's 'To the Hellfire': A Study in Heaviness.",
            "journal": "Metal Music Studies, 9(2), pp. 189–213.",
            "links": { "read": "https://doi.org/10.1386/mms_00105_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00105_1/reader" },
            "type": "article",
            "topics": "Heaviness,Metal Studies,Music Theory & Analysis",
            "keywords": "heaviness,metal,deathcore,music-analysis"
        },
        {
            "year": "2023",
            "authors": "(with Daniel Walzer, Jude Brereton & Mariana Lopez)",
            "title": "Editorial: Exploring Audio and Music Technology in Education: Pedagogical, Research and Sociocultural Perspectives.",
            "journal": "Journal of Music, Technology and Education, 15(1), pp. 3–6.",
            "links": { "read": "https://doi.org/10.1386/jmte_00045_2", "summary": "https://www.growkudos.com/publications/10.1386%25252Fjmte_00045_2/reader" },
            "type": "article",
            "topics": "Music Education & Pedagogy,Music Technology",
            "keywords": "education,music-technology,pedagogy"
        },
        {
            "year": "2023",
            "authors": "(with Mark Mynett)",
            "title": "\"I Just Go with What Feels Right.\" Variance and Commonality in Metal Music Mixing Practice.",
            "journal": "El Oido Pensante, 11(1), pp. 4–31.",
            "links": { "read": "https://doi.org/10.34096/oidopensante.v11n1.10704", "summary": "https://www.growkudos.com/publications/10.34096%25252Foidopensante.v11n1.10704/reader" },
            "type": "article",
            "topics": "Music Production,Metal Studies,Research Methods",
            "keywords": "music-production,metal,mixing,producer-interviews"
        },
        {
            "year": "2023",
            "authors": "(with Jamie Boddington Jordan)",
            "title": "Harmonic Structures in Twenty-First-Century Metal Music: A Harmonic Analysis of Five Major Metal Genres.",
            "journal": "Metal Music Studies, 9(1), pp. 27–58.",
            "links": { "read": "https://doi.org/10.1386/mms_00093_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00093_1/reader" },
            "type": "article",
            "topics": "Metal Studies,Music Theory & Analysis",
            "keywords": "metal,harmony,music-analysis,subgenres"
        },

        // 2022 Articles
        {
            "year": "2022",
            "authors": "(with Reuben Swallow)",
            "title": "Dissonance in Metal Music: Musical and Sociocultural Reasons for Metal's Appreciation of Dissonance.",
            "journal": "Metal Music Studies, 8(3), pp. 351–379.",
            "links": { "read": "https://doi.org/10.1386/mms_00085_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00085_1/reader", "download": "../publications/research_articles/Swallow & Herbst 2022 - Dissonance in Metal Music.pdf" },
            "type": "article",
            "topics": "Metal Studies,Music Theory & Analysis,Music Psychology & Perception",
            "keywords": "metal,dissonance,music-analysis,music-psychology"
        },
        {
            "year": "2022",
            "authors": "(with Mark Mynett)",
            "title": "What is 'Heavy' in Metal? A Netnographic Analysis of Online Forums for Metal Musicians and Producers.",
            "journal": "Popular Music and Society Studies, 45(5), pp. 633–653.",
            "links": { "read": "https://doi.org/10.1080/03007766.2022.2114155", "summary": "https://www.growkudos.com/publications/10.1080%25252F03007766.2022.2114155/reader" },
            "type": "article",
            "topics": "Heaviness,Metal Studies,Research Methods,Fandom, Identity & Subculture",
            "keywords": "heaviness,metal,netnography,fandom"
        },
        {
            "year": "2022",
            "authors": "(with Mark Mynett)",
            "title": "Toward a Systematic Understanding of \"Heaviness\" in Metal Music Production.",
            "journal": "Rock Music Studies, 10(1), pp. 16–37.",
            "links": { "read": "https://doi.org/10.1080/19401159.2022.2109358", "summary": "https://www.growkudos.com/publications/10.1080%25252F19401159.2022.2109358/reader" },
            "type": "article",
            "topics": "Heaviness,Music Production,Metal Studies",
            "keywords": "heaviness,music-production,metal"
        },
        {
            "year": "2022",
            "authors": "(with Mark Mynett)",
            "title": "Keeper of the Seven Keys: Audio Heritage in Metal Music Production.",
            "journal": "Metal Music Studies, 8(1), pp. 109–126.",
            "links": { "read": "https://doi.org/10.1386/mms_00063_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00063_1/reader", "download": "../publications/research_articles/Herbst 2022 - Keeper.pdf" },
            "type": "article",
            "topics": "Audio Heritage & Archiving,Metal Studies,Music Production",
            "keywords": "audio-heritage,metal,heritage,recording-studios"
        },
        {
            "year": "2022",
            "authors": "",
            "title": "The Recording Industry as the Enemy? A Case Study of Early West German Metal Music.",
            "journal": "International Journal of the Sociology of Leisure, 5, pp. 229–254.",
            "links": { "read": "https://link.springer.com/article/10.1007%2Fs41978-021-00098-z", "summary": "https://www.growkudos.com/publications/10.1007%25252Fs41978-021-00098-z/reader" },
            "type": "article",
            "topics": "German Music & Teutonic Metal,Music Industry & Labor,Music, Culture & Society",
            "keywords": "Germany,German-metal-scene,music-industry,leisure-studies"
        },

        // 2021 Articles
        {
            "year": "2021",
            "authors": "(with Mark Mynett)",
            "title": "Nail the Mix: Standardization in Mixing Metal Music?",
            "journal": "Popular Music and Society, 44(5), pp. 628–649.",
            "links": { "read": "https://doi.org/10.1080/03007766.2021.1957544", "summary": "https://www.growkudos.com/publications/10.1080%25252F03007766.2021.1957544/reader" },
            "type": "article",
            "topics": "Music Production,Metal Studies,Music Technology",
            "keywords": "music-production,metal,standardization,mixing"
        },
        {
            "year": "2021",
            "authors": "(with Mark Mynett)",
            "title": "(No?) Adventures in Recording Land: Engineering Conventions in Metal Music.",
            "journal": "Rock Music Studies, 9(2), pp. 137–156.",
            "links": { "read": "https://doi.org/10.1080/19401159.2021.1936410", "summary": "https://www.growkudos.com/publications/10.1080%25252F19401159.2021.1936410/reader" },
            "type": "article",
            "topics": "Music Production,Metal Studies",
            "keywords": "music-production,metal,recording,sound-engineering"
        },
        {
            "year": "2021",
            "authors": "",
            "title": "The Politics of Rammstein's Sound: Decoding a Production Aesthetic.",
            "journal": "Journal of Popular Music Studies, 33(2), pp. 51–76.",
            "links": { "read": "https://doi.org/10.1525/jpms.2021.33.2.51", "summary": "https://www.growkudos.com/publications/10.1525%25252Fjpms.2021.33.2.51/reader", "download": "../publications/research_articles/Herbst 2021 - Politics.pdf" },
            "type": "article",
            "topics": "Music & Politics,German Music & Teutonic Metal,Music Production",
            "keywords": "politics,Germany,music-production,provocation"
        },
        {
            "year": "2021",
            "authors": "",
            "title": "Teutonic Metal: Effects of Place- and Mythology-Based Labels on Record Production.",
            "journal": "International Journal of the Sociology of Leisure, 4, pp. 291–313.",
            "links": { "read": "https://doi.org/10.1007/s41978-021-00084-5", "summary": "https://www.growkudos.com/publications/10.1007%25252Fs41978-021-00084-5/reader" },
            "type": "article",
            "topics": "German Music & Teutonic Metal,Music Production,Music, Culture & Society",
            "keywords": "Teutonic-metal,Germany,music-production,national-identity"
        },
        {
            "year": "2021",
            "authors": "",
            "title": "Recording Studios as Museums? Record Producers' Perspectives on German Rock Studios and Accounts of their Heritage Practices.",
            "journal": "Popular Music, 40(2), pp. 91–113.",
            "links": { "read": "https://doi.org/10.1017/S026114302100009X", "summary": "https://www.growkudos.com/publications/10.1017%25252Fs026114302100009x/reader" },
            "type": "article",
            "topics": "Audio Heritage & Archiving,Music Production,German Music & Teutonic Metal",
            "keywords": "audio-heritage,recording-studios,heritage,museums,Germany"
        },
        {
            "year": "2021",
            "authors": "(with Michael Ahlers)",
            "title": "Introduction to the Special Issue on Crises at Work: Potentials for Change?.",
            "journal": "IASPM Journal, 11(1), pp. 2–5.",
            "links": { "read": "https://doi.org/10.5429/2079-3871(2021)v11i1.2en", "summary": "https://www.growkudos.com/publications/10.5429%25252F2079-3871%25282021%2529v11i1.2en/reader" },
            "type": "article",
            "topics": "Music Industry & Labor,Music & Politics",
            "keywords": "music-industry,crisis,COVID-19"
        },
        {
            "year": "2021",
            "authors": "(with Karl Spracklen)",
            "title": "Metal Music Studies at the Intersection of Theory and Practice.",
            "journal": "Metal Music Studies, 7(3), pp. 351–356.",
            "links": { "read": "https://doi.org/10.1386/mms_00054_2", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00054_2/reader", "download": "../publications/research_articles/Herbst & Spracklen 2021 - Intersection.pdf" },
            "type": "article",
            "topics": "Metal Studies,Research Methods",
            "keywords": "metal-music-studies,interdisciplinarity,research-methods"
        },
        {
            "year": "2021",
            "authors": "",
            "title": "Culture-Specific Production and Performance Characteristics: An Interview Study with 'Teutonic' Metal Producers.",
            "journal": "Metal Music Studies, 7(3), pp. 445–467.",
            "links": { "read": "https://doi.org/10.1386/mms_00059_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00059_1/reader", "download": "../publications/research_articles/Herbst 2021 - Culture-specific.pdf" },
            "type": "article",
            "topics": "German Music & Teutonic Metal,Music Production,Music, Culture & Society",
            "keywords": "Teutonic-metal,Germany,music-production,cultural-studies"
        },

        // 2020 Articles
        {
            "year": "2020",
            "authors": "",
            "title": "Metronomic Precision of 'Teutonic Metal': A Methodological Challenge for Rhythm and Performance Research.",
            "journal": "Samples, 18, pp. 1–27.",
            "links": { "read": "https://gfpm-samples.de/index.php/samples/article/view/202/196" },
            "type": "article",
            "topics": "German Music & Teutonic Metal,Performance & Live Music,Research Methods",
            "keywords": "Teutonic-metal,performance,quantization,research-methods"
        },
        {
            "year": "2020",
            "authors": "(with Thomas Thurnell-Read, David Robinson & Karl Spracklen)",
            "title": "Rhythm and Booze: Contesting Leisure Mobilities on the Transpennine Real Ale Trail.",
            "journal": "Mobilities, 16(3), pp. 322–338.",
            "links": { "read": "https://doi.org/10.1080/17450101.2020.1820189", "summary": "https://www.growkudos.com/publications/10.1080%25252F17450101.2020.1820189/reader" },
            "type": "article",
            "topics": "Music, Culture & Society",
            "keywords": "leisure-studies,consumption,counterculture"
        },
        {
            "year": "2020",
            "authors": "",
            "title": "Sonic Signatures in Metal Music Production: Teutonic vs British vs American Sound.",
            "journal": "Samples, 18, pp. 1–26.",
            "links": { "read": "https://gfpm-samples.de/index.php/samples/article/view/201/195" },
            "type": "article",
            "topics": "German Music & Teutonic Metal,Music Production,Distortion & Sound",
            "keywords": "Teutonic-metal,music-production,sonic-signature,sound-analysis"
        },
        {
            "year": "2020",
            "authors": "",
            "title": "From Bach to Helloween: 'Teutonic' Stereotypes in the History of Popular Music.",
            "journal": "Metal Music Studies, 6(1), pp. 87–108.",
            "links": { "read": "https://doi.org/10.1386/mms_00006_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms_00006_1/reader", "download": "../publications/research_articles/Herbst 2020 - From Bach to Helloween.pdf" },
            "type": "article",
            "topics": "German Music & Teutonic Metal,Popular Music Studies,Music, Culture & Society",
            "keywords": "Germany,Teutonic-metal,popular-music,music-history,German-identity"
        },

        // 2019 Articles
        {
            "year": "2019",
            "authors": "",
            "title": "Empirical Explorations of Guitar Players' Attitudes towards their Equipment and the Role of Distortion in Rock Music.",
            "journal": "Current Musicology, 105, pp. 75–106.",
            "links": { "read": "https://doi.org/10.7916/cm.v0i105.5404", "summary": "https://www.growkudos.com/profile/jan_herbst/publications" },
            "type": "article",
            "topics": "Guitar & Virtuosity,Gear & Equipment,Distortion & Sound",
            "keywords": "guitar,gear-acquisition-syndrome,distortion,equipment"
        },
        {
            "year": "2019",
            "authors": "",
            "title": "Distortion and Rock Guitar Harmony: The Influence of Distortion Level and Structural Complexity on Acoustic Features and Perceived Pleasantness of Guitar Chords.",
            "journal": "Music Perception, 36(4), pp. 335–352.",
            "links": { "read": "http://doi.org/10.1525/mp.2019.36.4.335", "summary": "https://www.growkudos.com/publications/10.1525%25252Fmp.2019.36.4.335/reader", "download": "../publications/research_articles/Herbst 2019 - Distortion and Rock Guitar Harmony.pdf" },
            "type": "article",
            "topics": "Guitar & Virtuosity,Distortion & Sound,Music Psychology & Perception,Music Theory & Analysis",
            "keywords": "guitar-distortion,harmony,psychoacoustics,pleasantness,music-psychology"
        },
        {
            "year": "2019",
            "authors": "",
            "title": "The Formation of the West German Power Metal Scene and the Question of a 'Teutonic' Sound.",
            "journal": "Metal Music Studies, 5(2), pp. 201–223.",
            "links": { "read": "https://doi.org/10.1386/mms.5.2.201_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms.5.2.201_1/reader", "download": "../publications/research_articles/Herbst 2019 - Formation.pdf" },
            "type": "article",
            "topics": "German Music & Teutonic Metal,Metal Studies,Music, Culture & Society",
            "keywords": "Germany,Teutonic-metal,power-metal,German-metal-scene"
        },
        {
            "year": "2019",
            "authors": "",
            "title": "Old Sounds with New Technologies? Examining the Creative Potential of Guitar 'Profiling' Technology and the Future of Metal Music from Producers' Perspectives.",
            "journal": "Metal Music Studies, 5(1), pp. 53–69.",
            "links": { "read": "https://doi.org/10.1386/mms.5.1.53_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms.5.1.53_1/reader", "download": "../publications/research_articles/Herbst 2019 - Old Sounds.pdf" },
            "type": "article",
            "topics": "Music Technology,Guitar & Virtuosity,Metal Studies,Aesthetics & Creativity",
            "keywords": "guitar-profiling,technology,metal,innovation,conservatism"
        },

        // 2018 Articles
        {
            "year": "2018",
            "authors": "(with Tim Albrecht)",
            "title": "The Work Realities of Professional Studio Musicians in the German Popular Music Recording Industry: Careers, Practices and Economic Situations.",
            "journal": "IASPM Journal, 8(2), pp. 18–37.",
            "links": { "read": "https://dx.doi.org/10.5429/2079-3871(2018)v8i2.3en", "summary": "https://www.growkudos.com/publications/10.5429%25252F2079-3871%25282018%2529v8i2.3en/reader" },
            "type": "article",
            "topics": "Music Industry & Labor,Popular Music Studies",
            "keywords": "studio-musicians,music-industry,working-conditions,precarious-labor"
        },
        {
            "year": "2018",
            "authors": "(with Tim Albrecht)",
            "title": "The Skillset of Professional Studio Musicians in the German Popular Music Recording Industry.",
            "journal": "Etnomusikologian vuosikirja (The Finnish Yearbook of Ethnomusicology), 30, pp. 121–153.",
            "links": { "read": "https://doi.org/10.23985/evk.69085", "summary": "https://www.growkudos.com/publications/10.23985%25252Fevk.69085/reader" },
            "type": "article",
            "topics": "Music Industry & Labor,Popular Music Studies",
            "keywords": "studio-musicians,professionalism,music-industry"
        },
        {
            "year": "2018",
            "authors": "(with Isabella Czedik-Eysenberg and Christoph Reuter)",
            "title": "Guitar Profiling Technology in Metal Music Production: Public Reception, Capability, Consequences and Perspectives.",
            "journal": "Metal Music Studies, 4(3), pp. 481–506.",
            "links": { "read": "https://doi.org/10.1386/mms.4.3.481_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms.4.3.481_1/reader", "download": "../publications/research_articles/Herbst et al 2018 - Profiling.pdf" },
            "type": "article",
            "topics": "Music Technology,Guitar & Virtuosity,Metal Studies",
            "keywords": "guitar-profiling,technology,metal,digital-tools"
        },
        {
            "year": "2018",
            "authors": "",
            "title": "Heaviness and the Electric Guitar: Considering the Interaction between Distortion and Harmonic Structures.",
            "journal": "Metal Music Studies, 4(1), pp. 95–113.",
            "links": { "read": "https://doi.org/10.1386/mms.4.1.95_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms.4.1.95_1/reader", "download": "../publications/research_articles/Herbst 2018 - Heaviness.pdf" },
            "type": "article",
            "topics": "Heaviness,Guitar & Virtuosity,Distortion & Sound,Metal Studies",
            "keywords": "heaviness,guitar,distortion,metal,harmony"
        },

        // 2017 Articles
        {
            "year": "2017",
            "authors": "(with Jan Holthaus)",
            "title": "Music Studio Operators in the Ruhr Area in Germany: Role, Services, and Resources.",
            "journal": "Etnomusikologian vuosikirja (The Finnish Yearbook of Ethnomusicology), vol. 29, pp. 1–30.",
            "links": { "read": "https://doi.org/10.23985/evk.63490", "summary": "https://www.growkudos.com/publications/10.23985%25252Fevk.63490/reader" },
            "type": "article",
            "topics": "Music Industry & Labor,German Music & Teutonic Metal",
            "keywords": "studio-operators,music-industry,Germany,Ruhr-Area"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "Shredding, Tapping and Sweeping: Effects of Guitar Distortion on Playability and Expressiveness in Rock and Metal Solos.",
            "journal": "Metal Music Studies, 3(2), pp. 231–250.",
            "links": { "read": "https://doi.org/10.1386/mms.3.2.231_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms.3.2.231_1/reader", "download": "../publications/research_articles/Herbst 2017 - Shredding.pdf" },
            "type": "article",
            "topics": "Guitar & Virtuosity,Distortion & Sound,Metal Studies",
            "keywords": "guitar,virtuosity,shredding,distortion,metal"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "Historical Development, Sound Aesthetics and Production Techniques of the Distorted Electric Guitar in Metal Music.",
            "journal": "Metal Music Studies, 3(1), pp. 24–46.",
            "links": { "read": "https://doi.org/10.1386/mms.3.1.23_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fmms.3.1.23_1/reader", "download": "../publications/research_articles/Herbst 2017 - Historical Development.pdf" },
            "type": "article",
            "topics": "Guitar & Virtuosity,Distortion & Sound,Metal Studies,Music Production",
            "keywords": "guitar,distortion,metal,music-history,sound-aesthetics"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "Akkordstrukturen im verzerrten Rockgitarrenriff: Eine experimental-analytische Studie zur Auswirkung von physikalischen und psycho-akustischen Faktoren.",
            "journal": "Samples, 15, pp. 1–27.",
            "links": { "read": "https://gfpm-samples.de/index.php/samples/article/view/232/225" },
            "type": "article",
            "topics": "Guitar & Virtuosity,Distortion & Sound,Music Psychology & Perception",
            "keywords": "guitar,distortion,psychoacoustics,chord-structures"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "Remixing Dub Reggae in the Music Classroom: A Practice-Based Case Study on the Value of Music Production Tasks for Listening Skills, Media Competency and Musical Knowledge.",
            "journal": "Journal of Music, Technology and Education, 9(3), pp. 255–272.",
            "links": { "read": "https://doi.org/10.1386/jmte.9.3.255_1", "summary": "https://www.growkudos.com/publications/10.1386%25252Fjmte.9.3.255_1/reader", "download": "../publications/research_articles/Herbst 2016 - Remixing.pdf" },
            "type": "article",
            "topics": "Music Education & Pedagogy,Music Production,Music Technology",
            "keywords": "education,music-production,listening-skills,pedagogy"
        },

        // 2016 Articles
        {
            "year": "2016",
            "authors": "",
            "title": "Kommunikation und Wissenserwerb in der Vorlesung: Eine quantitative Studie zum Einsatz kommunikationsanregender Methoden in der Vorlesung.",
            "journal": "die hochschullehre, 2(1), pp. 1–21.",
            "links": { "read": "https://doi.org/10.3278/HSL1605W", "summary": "https://www.growkudos.com/publications/10.3278%25252Fhsl1605w/reader" },
            "type": "article",
            "topics": "Music Education & Pedagogy",
            "keywords": "education,higher-education,lecture-format,communication"
        },

        // Books
        {
            "year": "2025",
            "authors": "Michael Ahlers, Jan-Peter Herbst & Knut Holtsträter (Eds.)",
            "title": "Popular Music Songwriting as Cultural, Creative, and Economic Practice",
            "publisher": "Münster: Waxmann",
            "links": { "publisher": "https://www.waxmann.com/buecher/Lied-und-populaere-Kultur--Song-and-Popular-Culture-200051" },
            "type": "book",
            "topics": "Songwriting & Collaboration,Popular Music Studies,Music Industry & Labor",
            "keywords": "songwriting,popular-music,collaboration,music-industry"
        },
        {
            "year": "2025",
            "authors": "Jan-Peter Herbst & Mark Mynett",
            "title": "Heaviness in Metal Music Production: How and Why It Works (Vol. 1)",
            "publisher": "London: Routledge",
            "links": { "publisher": "https://www.routledge.com/Heaviness-in-Metal-Music-Production-Volume-I-How-and-Why-it-Works/Herbst-Mynett/p/book/9781032346212" },
            "type": "book",
            "topics": "Heaviness,Music Production,Metal Studies",
            "keywords": "heaviness,music-production,metal"
        },
        {
            "year": "2025",
            "authors": "Jan-Peter Herbst & Mark Mynett",
            "title": "Heaviness in Metal Music Production: Learn From the Masters (Vol. 2)",
            "publisher": "London: Routledge",
            "links": { "publisher": "https://www.routledge.com/Heaviness-in-Metal-Music-Production-Volume-II-Learn-from-the-Masters/Herbst-Mynett/p/book/9781032915586" },
            "type": "book",
            "topics": "Heaviness,Music Production,Metal Studies",
            "keywords": "heaviness,music-production,metal"
        },
        {
            "year": "2024",
            "authors": "Jan-Peter Herbst & Steve Waksman (Eds.)",
            "title": "The Cambridge Companion to the Electric Guitar",
            "publisher": "Cambridge University Press",
            "links": { "publisher": "https://www.cambridge.org/core/books/cambridge-companion-to-the-electric-guitar/4772610E775C8082D5D96CD7AE95A557#" },
            "type": "book",
            "topics": "Guitar & Virtuosity,Popular Music Studies",
            "keywords": "guitar,electric-guitar,popular-music"
        },
        {
            "year": "2023",
            "authors": "Jan-Peter Herbst & Alexander Vallejo",
            "title": "Rock Guitar Virtuosos: Advances in Electric Guitar Playing, Technology and Culture",
            "publisher": "Cambridge University Press",
            "links": { "publisher": "https://www.cambridge.org/core/elements/abs/rock-guitar-virtuosos/0D40C7DF7198C027B276A85AD74B9E0D" },
            "type": "book",
            "topics": "Guitar & Virtuosity,Music Technology",
            "keywords": "guitar,virtuosity,technology"
        },
        {
            "year": "2023",
            "authors": "Jan-Peter Herbst (Ed.)",
            "title": "The Cambridge Companion to Metal Music",
            "publisher": "Cambridge University Press",
            "links": { "publisher": "https://doi.org/10.1017/9781108991162" },
            "type": "book",
            "topics": "Metal Studies",
            "keywords": "metal,metal-music-studies"
        },
        {
            "year": "2022",
            "authors": "Jan-Peter Herbst, Kerstin Wilhelms et al.",
            "title": "Rammstein's \"Germany\": Pop - Politics - Provocations",
            "publisher": "Springer",
            "links": { "publisher": "https://link.springer.com/book/10.1007/978-3-662-64766-0" },
            "type": "book",
            "topics": "Music & Politics,German Music & Teutonic Metal",
            "keywords": "politics,Germany,provocation"
        },
        {
            "year": "2021",
            "authors": "Jan-Peter Herbst & Jonas Menze",
            "title": "Gear Acquisition Syndrome: Consumption of Instruments and Technology in Popular Music",
            "publisher": "University of Huddersfield Press",
            "links": { "website": "https://thegearacquisitionsyndrome.com/", "openAccess": "https://unipress.hud.ac.uk/plugins/books/27/" },
            "type": "book",
            "topics": "Gear & Equipment,Popular Music Studies",
            "keywords": "gear-acquisition-syndrome,consumption,equipment"
        },
        {
            "year": "2016",
            "authors": "Jan-Peter Herbst",
            "title": "Die Gitarrenverzerrung in der Rockmusik",
            "publisher": "LIT Verlag",
            "links": { "publisher": "https://www.lit-verlag.de/isbn/978-3-643-13553-7" },
            "type": "book",
            "topics": "Guitar & Virtuosity,Distortion & Sound",
            "keywords": "guitar,distortion,rock-music"
        },
        {
            "year": "2014",
            "authors": "Jan-Peter Herbst",
            "title": "Netzwerk Sound",
            "publisher": "Wissner",
            "links": { "publisher": "https://www.wissner.com/detailsuche/search?keyword=Netzwerk%20Sound&option=com_virtuemart&page=shop.browse&search=true&view=category&limitstart=0" },
            "type": "book",
            "topics": "Music Production,Music Technology",
            "keywords": "music-production,technology,sound-studies"
        },

        // Book Chapters - Complete List
        {
            "year": "2025",
            "authors": "",
            "title": "Martin Birch - Catalyst: The Pivotal Role of Deep Purple's Sound Engineer on the Classic Mk. 2 Albums",
            "booktitle": "Who Do We Think They Are? : Deep Purple and Metal Studies. London: Equinox Publishing (forthcoming).",
            "links": {},
            "type": "chapter",
            "topics": "Music Production,Audio Heritage & Archiving",
            "keywords": "music-production,audio-heritage,sound-engineering"
        },
        {
            "year": "2025",
            "authors": "",
            "title": "Heaviness: An Introduction to Metal's Prime Musical Quality",
            "booktitle": "Metal Studies: The Loudest Handbook. Freiburg: Rombach Wissenschaft (forthcoming).",
            "links": {},
            "type": "chapter",
            "topics": "Heaviness,Metal Studies",
            "keywords": "heaviness,metal,metal-music-studies"
        },
        {
            "year": "2025",
            "authors": "(with Mark Mynett)",
            "title": "Contemporary Approaches to Metal Music Mixing and Production: Heavy Metal, Death Metal, and Metalcore",
            "booktitle": "The Routledge Handbook of Metal Music Composition. London: Routledge, pp. 469–481.",
            "links": { "doi": "https://doi.org/10.4324/9781003354451-34" },
            "type": "chapter",
            "topics": "Music Production,Metal Studies",
            "keywords": "music-production,metal,mixing,heavy-metal,death-metal,metalcore"
        },
        {
            "year": "2025",
            "authors": "",
            "title": "Songwriting-Camps: Kollaborative Songwriting-Praxis zwischen Songwriting-Tradition und musikindustrieller Transformation",
            "booktitle": "Musik in der spätmodernen Gesellschaft. Analysen, Positionen, Perspektiven. Muenster: Waxmann, pp. 191–212.",
            "links": {},
            "type": "chapter",
            "topics": "Songwriting & Collaboration,Music Industry & Labor",
            "keywords": "songwriting-camps,collaboration,music-industry"
        },
        {
            "year": "2025",
            "authors": "(with Jan Nepomucen Pietrzak)",
            "title": "Collaboration in an Online Environment: Creativity in Popular Music Production in Times of Covid-19",
            "booktitle": "Popular Music Songwriting as Cultural, Creative, and Economic Practice. Muenster: Waxmann, pp. 111–136.",
            "links": {},
            "type": "chapter",
            "topics": "Songwriting & Collaboration,Music & Politics,Music Technology",
            "keywords": "online-collaboration,COVID-19,creativity,popular-music"
        },
        {
            "year": "2025",
            "authors": "(with Michael Ahlers and Knut Holtsträter)",
            "title": "Preface",
            "booktitle": "Popular Music Songwriting as Cultural, Creative, and Economic Practice. Muenster: Waxmann, pp. 9–12.",
            "links": {},
            "type": "chapter",
            "topics": "Songwriting & Collaboration,Popular Music Studies",
            "keywords": "songwriting,popular-music"
        },
        {
            "year": "2024",
            "authors": "(with Steve Waksman)",
            "title": "Introduction to the Cambridge Companion to the Electric Guitar",
            "booktitle": "The Cambridge Companion to the Electric Guitar. Cambridge: Cambridge University Press, pp. 1–13.",
            "links": { "doi": "https://doi.org/10.1017/9781009224420.001" },
            "type": "chapter",
            "topics": "Guitar & Virtuosity,Popular Music Studies",
            "keywords": "guitar,electric-guitar,popular-music"
        },
        {
            "year": "2024",
            "authors": "(with Alexander Vallejo)",
            "title": "Thumping, Glitch, and Butterfly Tapping: Innovations in Guitar Technique in the New Millennium",
            "booktitle": "The Cambridge Companion to the Electric Guitar. Cambridge: Cambridge University Press, pp. 165–188.",
            "links": { "doi": "https://doi.org/10.1017/9781009224420.010" },
            "type": "chapter",
            "topics": "Guitar & Virtuosity,Music Technology",
            "keywords": "guitar,virtuosity,guitar-technique,innovation"
        },
        {
            "year": "2024",
            "authors": "(with Michael Ahlers)",
            "title": "Songwriting Camps: Geschichte, Theorien und Forschungsansätze zur Fließband-Produktion von populärer Musik",
            "booktitle": "Parallelgesellschaften in Populärer Musik: Abgrenzungen, Annäherungen, Perspektiven. Bielefeld: transcript, pp. 315–342.",
            "links": { "download": "../publications/chapters/Ahlers & Herbst 2024 - Songwriting Camps.pdf" },
            "type": "chapter",
            "topics": "Songwriting & Collaboration,Music Industry & Labor",
            "keywords": "songwriting-camps,music-industry,collaboration"
        },
        {
            "year": "2024",
            "authors": "(with Eric Smialek & Isabella Czedik-Eysenberg)",
            "title": "Towards an Acoustic-Semantic Space of Extreme Metal Vocal Styles",
            "booktitle": "Proceedings of the German Society for Acoustics' Annual Conference for Acoustics, Leibniz University of Hanover (GER), 18-21 March 2024, pp. 979–982.",
            "links": { "download": "https://pub.dega-akustik.de/DAGA_2024/konferenz?article=456" },
            "type": "chapter",
            "topics": "Metal Studies,Music Psychology & Perception,Research Methods",
            "keywords": "metal,vocals,acoustics,semantics"
        },
        {
            "year": "2023",
            "authors": "",
            "title": "Introduction to the Cambridge Companion to Metal Music",
            "booktitle": "The Cambridge Companion to Metal Music. Cambridge: Cambridge University Press, pp. 1–11.",
            "links": { "doi": "https://doi.org/10.1017/9781108991162" },
            "type": "chapter",
            "topics": "Metal Studies",
            "keywords": "metal,metal-music-studies"
        },
        {
            "year": "2023",
            "authors": "(with Mark Mynett)",
            "title": "Mapping the Origins of Heaviness between 1970-1995: A Historical Overview of Metal Music Production",
            "booktitle": "The Cambridge Companion to Metal Music. Cambridge: Cambridge University Press, pp. 29–42.",
            "links": { "doi": "https://doi.org/10.1017/9781108991162" },
            "type": "chapter",
            "topics": "Heaviness,Music Production,Metal Studies",
            "keywords": "heaviness,music-production,metal,music-history"
        },
        {
            "year": "2023",
            "authors": "",
            "title": "'It Just Is My Inner Refusal': Innovation and Conservatism in Guitar Amplification Technology",
            "booktitle": "Distortion in Music Production. London: Routledge, pp. 174–184.",
            "links": { "doi": "https://doi.org/10.4324/9780429356841" },
            "type": "chapter",
            "topics": "Guitar & Virtuosity,Music Technology,Aesthetics & Creativity",
            "keywords": "guitar-amplification,innovation,conservatism,technology"
        },
        {
            "year": "2022",
            "authors": "",
            "title": "Infrastructure of the German Music Business",
            "booktitle": "The Cambridge Companion to Krautrock. Cambridge: Cambridge University Press, pp. 59–73.",
            "links": { "doi": "https://doi.org/10.1017/9781009036535.005" },
            "type": "chapter",
            "topics": "German Music & Teutonic Metal,Music Industry & Labor",
            "keywords": "Germany,music-industry,Krautrock"
        },
        {
            "year": "2022",
            "authors": "(with Lea Espinoza Garrado et al.)",
            "title": "Transformations of the National: Rammstein's \"Deutschland\" as a Provocation of German History",
            "booktitle": "Transformational POP: Transitions, Breaks, and Crises in Popular Music (Studies), pp. 179–204.",
            "links": { "openAccess": "http://vibes-theseries.org/wp-content/uploads/2022/10/Espinoza-Garrido-et-al.pdf" },
            "type": "chapter",
            "topics": "Music & Politics,German Music & Teutonic Metal",
            "keywords": "politics,Germany,provocation,national-identity"
        },
        {
            "year": "2020",
            "authors": "",
            "title": "Views of German Producers on 'Teutonic' Metal: Production Approaches and Generational Effects",
            "booktitle": "One Nation Under a Groove. 'Nation' als Kategorie populärer Musik. Bielefeld: transcript, pp. 183–206.",
            "links": { "download": "../publications/chapters/Herbst 2020 - Views of German Producers on Teutonic Metal.pdf" },
            "type": "chapter",
            "topics": "German Music & Teutonic Metal,Music Production",
            "keywords": "Teutonic-metal,Germany,music-production"
        },
        {
            "year": "2020",
            "authors": "",
            "title": "German Metal Attack: Power Metal in and from Germany",
            "booktitle": "Made in Germany (Global Popular Music series). London: Routledge, pp. 81–89.",
            "links": { "doi": "https://doi.org/10.4324/9781351200790-10" },
            "type": "chapter",
            "topics": "German Music & Teutonic Metal,Metal Studies",
            "keywords": "Germany,power-metal,German-metal-scene"
        },
        {
            "year": "2019",
            "authors": "",
            "title": "Moonlight Shadows: \"Licht und Schatten\" in Pink Floyds The Dark Side Of The Moon",
            "booktitle": "Vom Schatten aus. Denk- und Handlungsräume in Kunst und Kunstpädagogik. Hannover: fabricio, pp. 130–150.",
            "links": { "download": "../publications/chapters/Herbst 2019 - Moonlight Shadows.pdf" },
            "type": "chapter",
            "topics": "Aesthetics & Creativity,Popular Music Studies",
            "keywords": "light-and-shadow,aesthetics,art-rock"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "Virtuoses Sologitarrenspiel im Rock und Metal: Zum Einfluss von Verzerrung auf das \"Shredding\"",
            "booktitle": "Schneller, höher, lauter. Virtuosität in populären Musiken (Beiträge zur Popularmusikforschung, Bd. 43), pp. 131–152.",
            "links": { "openAccess": "http://geb.uni-giessen.de/geb/volltexte/2019/14258/pdf/Popularmusikforschung43_09_Herbst.pdf" },
            "type": "chapter",
            "topics": "Guitar & Virtuosity,Distortion & Sound",
            "keywords": "guitar,virtuosity,shredding,distortion"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "Influence of Distortion on Guitar Chord Structures: Acoustic Effects and Perceptual Correlates",
            "booktitle": "Musikpsychologie, vol. 27: Akustik und musikalische Hörwahrnehmung. Göttingen: Hogrefe, pp. 26–47.",
            "links": { "openAccess": "https://dx.doi.org/10.23668/psycharchives.2805" },
            "type": "chapter",
            "topics": "Guitar & Virtuosity,Distortion & Sound,Music Psychology & Perception",
            "keywords": "guitar-distortion,chord-structures,psychoacoustics"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "\"Gear Acquisition Syndrome\": A Study of Electric Guitar Players",
            "booktitle": "Popular Music Studies Today. Series Systematische Musikwissenschaft. Wiesbaden: Springer, pp. 139–148.",
            "links": { "download": "../publications/chapters/Herbst 2017 - Gear Aquisition Syndrome.pdf" },
            "type": "chapter",
            "topics": "Gear & Equipment,Guitar & Virtuosity",
            "keywords": "gear-acquisition-syndrome,guitar,equipment"
        },
        {
            "year": "2017",
            "authors": "",
            "title": "Resonanz",
            "booktitle": "Inklusionsaspekte in den künstlerischen Fächern und der ästhetischen Bildung. Hannover: Fabrico Verlag, pp. 217–222.",
            "links": {},
            "type": "chapter",
            "topics": "Music Education & Pedagogy,Aesthetics & Creativity",
            "keywords": "education,inclusion,arts-education"
        },
        {
            "year": "2015",
            "authors": "",
            "title": "\"What's that Sound?\" Sound als didaktische Herausforderung der Populären Musik",
            "booktitle": "Popmusik-Vermittlung. Zwischen Schule, Universität und Beruf (Theorie und Praxis der Musikvermittlung, vol. 14). Münster: LIT, pp. 133–152.",
            "links": { "download": "../publications/chapters/Herbst 2015 - What's that Sound.pdf" },
            "type": "chapter",
            "topics": "Music Education & Pedagogy,Popular Music Studies",
            "keywords": "education,popular-music,didactics,sound-studies"
        }
    ];
    
    const topicMap = {
        'Heaviness': ['heaviness', 'dissonance', 'transgression'],
        'Music Production': ['music-production', 'mixing', 'mastering', 'record-producers', 'recording', 'sound-engineering', 'audio-engineering', 'home-recording', 'standardization', 'experimentation', 'production-techniques', 'remastering', 'hyperrealism'],
        'Music Technology': ['music-technology', 'digital-music', 'technology', 'digital-tools', 'guitar-profiling', 'innovation', 'conservatism', 'technological-change', 'media-technology'],
        'Songwriting & Collaboration': ['songwriting', 'collaboration', 'songwriting-camps', 'creative-industries', 'post-industrialism', 'online-collaboration'],
        'Guitar & Virtuosity': ['guitar', 'virtuosity', 'shredding', 'guitar-solo', 'guitar-chords', 'guitar-amplification', 'electric-guitar', 'guitar-studies', 'guitar-technique'],
        'Metal Studies': ['metal', 'metal-music-studies', 'deathcore', 'djent', 'subgenres', 'German-metal-scene', 'power-metal', 'global-metal', 'metal-history'],
        'Popular Music Studies': ['popular-music', 'popular-music-studies', 'genre-studies', 'leisure-studies', 'music-history', 'reception-history', 'art-rock', 'interdisciplinarity'],
        'Music, Culture & Society': ['cultural-studies', 'authenticity', 'subculture', 'sociocultural-perspectives', 'leisure-studies', 'social-class', 'affect', 'German-identity', 'imagined-communities', 'counterculture', 'consumption', 'national-identity'],
        'Aesthetics & Creativity': ['aesthetics', 'creativity', 'musical-expression', 'transgression', 'innovation', 'light-and-shadow'],
        'Music Theory & Analysis': ['music-analysis', 'music-theory', 'harmony', 'rhythmanalysis', 'spectral-analysis'],
        'Music Psychology & Perception': ['psychoacoustics', 'embodiment', 'music-psychology', 'perception', 'sonic-metaphors', 'pleasantness', 'sensory-consonance', 'acoustics', 'semantics', 'multidimensional-scaling', 'expressiveness'],
        'Fandom, Identity & Subculture': ['fandom', 'identity', 'subculture', 'authenticity', 'imagined-communities', 'musician-identity', 'German-identity', 'national-identity'],
        'Music Industry & Labor': ['music-industry', 'collaboration', 'music-business', 'precarious-labor', 'studio-musicians', 'working-conditions', 'session-musicians', 'professionalism', 'studio-operators', 'record-producers', 'entrepreneurship', 'service-economy', 'independent-labels', 'music-market'],
        'German Music & Teutonic Metal': ['Germany', 'Teutonic-metal', 'German-identity', 'Krautrock', 'German-music-industry', 'Ruhr-Area', 'German-metal-scene', 'power-metal'],
        'Distortion & Sound': ['distortion', 'sound-studies', 'sonic-signature', 'guitar-distortion', 'sound-analysis'],
        'Performance & Live Music': ['live-performance', 'vocals', 'performance', 'quantization'],
        'Research Methods': ['qualitative-research', 'netnography', 'research-methods', 'practice-led-research', 'producer-interviews', 'practice-based-learning', 'interdisciplinarity', 'musician-surveys', 'quantitative-study', 'action-research', 'constructivism'],
        'Music Education & Pedagogy': ['education', 'pedagogy', 'listening-skills', 'higher-education', 'learning-methods', 'lecture-format', 'didactics', 'ear-training', 'arts-education', 'inclusion'],
        'Audio Heritage & Archiving': ['audio-heritage', 'archiving', 'recording-studios', 'heritage', 'museums'],
        'Music & Politics': ['politics', 'COVID-19', 'crisis', 'provocation', 'national-identity'],
        'Gear & Equipment': ['gear-acquisition-syndrome', 'equipment', 'guitar-amplification', 'gear']
    };
    
    new PublicationFilter(publications, topicMap);
});
