pipeline {
    agent any

    environment {
        DOCKER_IMAGE = nikhilabba12/cloud-banking"
    }

    stages {

        stage('Git Clone') {
            steps {
                git 'https://github.com/MADHU8912/cloud-banking-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE% .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        stage('Docker Push') {
            steps {
                bat 'docker push %DOCKER_IMAGE%'
            }
        }

        stage('Deploy Container') {
            steps {
                bat '''
                docker stop banking-container || exit 0
                docker rm banking-container || exit 0
                docker run -d -p 5000:5000 --name banking-container %DOCKER_IMAGE%
                '''
            }
        }
    }
}