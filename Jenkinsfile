node {
    stage('Checkout') {
        // Checkout the repository before running any parallel jobs
        git url: 'https://github.com/amits781/home_iot.git', branch: 'main'
    }

    stage('Verify Files') {
        // Optional: List files in workspace and inside subfolders to verify checkout success
        echo "Listing files in workspace root:"
        sh 'ls -l'
        echo "Listing files inside python_iot:"
        sh 'ls -l python_iot'
        echo "Listing files inside react_app:"
        sh 'ls -l react_app'
        echo "Listing files inside spring_boot_service:"
        sh 'ls -l spring_boot_service'
    }

    parallel(
        'Python IoT': {
            dir('python_iot') {
                load 'Jenkinsfile'
            }
        },
        'React App': {
            dir('react_app') {
                load 'Jenkinsfile'
            }
        },
        'Spring Boot Service': {
            dir('spring_boot_service') {
                load 'Jenkinsfile'
            }
        }
        // Add other parallel branches as needed
    )

    echo 'All parallel sub-pipelines completed.'
}

