// main.cpp
#include <glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
#include <vector>
#include <cmath>
#include <cstdlib>
#include <ctime>
#include <algorithm> // <--- FIXED: Needed for std::remove_if

const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

struct Shape {
    enum Type { RECTANGLE, CIRCLE, TRIANGLE, SQUARE } type;
    float x, y;
    float size;
    float r, g, b;
    float speedY = 0.01f;
};

std::vector<Shape> obstacles;
Shape player;
int score = 0;
bool gameOver = false;
bool gameStarted = false;
int obstacleSpawnCounter = 0;

const char* vertexShaderSource = R"(
#version 330 core
layout (location = 0) in vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
})";

const char* fragmentShaderSource = R"(
#version 330 core
out vec4 FragColor;
uniform vec3 shapeColor;
void main() {
    FragColor = vec4(shapeColor, 1.0);
})";

GLuint shaderProgram;

GLuint compileShader(GLenum type, const char* source) {
    GLuint shader = glCreateShader(type);
    glShaderSource(shader, 1, &source, nullptr);
    glCompileShader(shader);
    int success;
    char infoLog[512];
    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
    if(!success) {
        glGetShaderInfoLog(shader, 512, nullptr, infoLog);
        std::cerr << "Shader compilation error:\n" << infoLog << std::endl;
    }
    return shader;
}

GLuint createShaderProgram() {
    GLuint vertexShader = compileShader(GL_VERTEX_SHADER, vertexShaderSource);
    GLuint fragmentShader = compileShader(GL_FRAGMENT_SHADER, fragmentShaderSource);
    GLuint program = glCreateProgram();
    glAttachShader(program, vertexShader);
    glAttachShader(program, fragmentShader);
    glLinkProgram(program);
    int success;
    char infoLog[512];
    glGetProgramiv(program, GL_LINK_STATUS, &success);
    if(!success) {
        glGetProgramInfoLog(program, 512, nullptr, infoLog);
        std::cerr << "Shader linking error:\n" << infoLog << std::endl;
    }
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);
    return program;
}

void drawShape(const Shape& shape) {
    glUseProgram(shaderProgram);
    glUniform3f(glGetUniformLocation(shaderProgram, "shapeColor"), shape.r, shape.g, shape.b);
    std::vector<float> vertices;

    if (shape.type == Shape::RECTANGLE) {
        float w = shape.size * 1.5f, h = shape.size;
        vertices = {
            shape.x - w/2, shape.y - h/2,
            shape.x + w/2, shape.y - h/2,
            shape.x + w/2, shape.y + h/2,
            shape.x - w/2, shape.y + h/2
        };
    } else if (shape.type == Shape::SQUARE) {
        float s = shape.size;
        vertices = {
            shape.x - s/2, shape.y - s/2,
            shape.x + s/2, shape.y - s/2,
            shape.x + s/2, shape.y + s/2,
            shape.x - s/2, shape.y + s/2
        };
    } else if (shape.type == Shape::TRIANGLE) {
        float h = shape.size;
        vertices = {
            shape.x, shape.y + h/2,
            shape.x - h/2, shape.y - h/2,
            shape.x + h/2, shape.y - h/2
        };
    } else if (shape.type == Shape::CIRCLE) {
        int segments = 50;
        vertices.push_back(shape.x);
        vertices.push_back(shape.y);
        for (int i = 0; i <= segments; ++i) {
            float angle = 2.0f * 3.1415926f * i / segments;
            vertices.push_back(shape.x + cos(angle) * shape.size/2);
            vertices.push_back(shape.y + sin(angle) * shape.size/2);
        }
    }

    GLuint VBO, VAO;
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, vertices.size()*sizeof(float), vertices.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2*sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);

    if (shape.type == Shape::CIRCLE)
        glDrawArrays(GL_TRIANGLE_FAN, 0, (GLsizei)(vertices.size()/2));
    else if (shape.type == Shape::TRIANGLE)
        glDrawArrays(GL_TRIANGLES, 0, 3);
    else
        glDrawArrays(GL_TRIANGLE_FAN, 0, 4);

    glDeleteBuffers(1, &VBO);
    glDeleteVertexArrays(1, &VAO);
}

bool checkCollision(const Shape& p, const Shape& o) {
    float halfP = p.size / 2, halfO = o.size / 2;
    return !(p.x + halfP < o.x - halfO || p.x - halfP > o.x + halfO ||
             p.y + halfP < o.y - halfO || p.y - halfP > o.y + halfO);
}

bool colorMatch(float r1, float g1, float b1, float r2, float g2, float b2) {
    const float tol = 0.1f;
    return (fabs(r1 - r2) < tol) && (fabs(g1 - g2) < tol) && (fabs(b1 - b2) < tol);
}

void cyclePlayerShape() {
    player.type = static_cast<Shape::Type>((player.type + 1) % 4);
}

void spawnObstacle() {
    Shape o;
    o.x = ((rand() % 1600) / 800.0f) - 1.0f;
    o.y = 1.2f;
    o.size = 0.15f;
    o.speedY = 0.008f + ((rand() % 5) * 0.002f);
    o.type = static_cast<Shape::Type>(rand() % 4);
    const float colors[6][3] = {
        {1, 0, 0}, {0, 1, 0}, {0, 0, 1},
        {1, 1, 0}, {1, 0, 1}, {0, 1, 1}
    };
    int idx = rand() % 6;
    o.r = colors[idx][0]; o.g = colors[idx][1]; o.b = colors[idx][2];
    obstacles.push_back(o);
}

void printInstructions() {
    std::cout << "===== SHAPE DODGER GAME =====\n";
    std::cout << "Controls:\n  Arrow Left/Right - Move Player\n  R - Restart Game\n";
    std::cout << "Goal: Avoid differently-colored shapes, collect same-colored ones for points!\n";
    std::cout << "=============================\n";
}

void playerChoose() {
    std::cout << "Choose starting shape (0=RECT, 1=CIRC, 2=TRI, 3=SQ): ";
    int s = 0; std::cin >> s;
    player.type = static_cast<Shape::Type>((s >= 0 && s <= 3) ? s : 0);
    std::cout << "Choose color (0=Red, 1=Green, 2=Blue, 3=Yel, 4=Mag, 5=Cyan): ";
    int c = 0; std::cin >> c;
    const float colors[6][3] = {
        {1, 0, 0}, {0, 1, 0}, {0, 0, 1},
        {1, 1, 0}, {1, 0, 1}, {0, 1, 1}
    };
    c = (c >= 0 && c <= 5) ? c : 0;
    player.r = colors[c][0]; player.g = colors[c][1]; player.b = colors[c][2];
    player.x = 0.0f; player.y = -0.8f; player.size = 0.2f;
    score = 0; gameOver = false; obstacles.clear(); obstacleSpawnCounter = 0;
}

void keyCallback(GLFWwindow* window, int key, int, int action, int) {
    if(action == GLFW_PRESS && key == GLFW_KEY_R && gameOver) {
        std::cout << "Restarting...\n";
        playerChoose(); gameStarted = true;
    }
}

int main() {
    srand(static_cast<unsigned int>(time(nullptr)));
    printInstructions();

    if(!glfwInit()) return -1;
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "Shape Dodger Game", nullptr, nullptr);
    if(!window) { glfwTerminate(); return -1; }
    glfwMakeContextCurrent(window);
    if(!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) return -1;

    shaderProgram = createShaderProgram();
    glfwSetKeyCallback(window, keyCallback);
    playerChoose();
    gameStarted = true;

    while(!glfwWindowShouldClose(window)) {
        glClearColor(0.15f, 0.15f, 0.15f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        if(gameStarted && !gameOver) {
            if(glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS)
                player.x = std::max(player.x - 0.02f, -1.0f + player.size/2);
            if(glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS)
                player.x = std::min(player.x + 0.02f, 1.0f - player.size/2);

            if(++obstacleSpawnCounter > 100) {
                spawnObstacle(); obstacleSpawnCounter = 0;
            }

            for(auto& o : obstacles) o.y -= o.speedY;

            // FIXED: Include <algorithm> to use std::remove_if
            obstacles.erase(std::remove_if(obstacles.begin(), obstacles.end(),
                [](const Shape& o){ return o.y < -1.2f; }), obstacles.end());

            for(size_t i = 0; i < obstacles.size(); ++i) {
                if(checkCollision(player, obstacles[i])) {
                    if(colorMatch(player.r, player.g, player.b,
                                  obstacles[i].r, obstacles[i].g, obstacles[i].b)) {
                        score += 10; cyclePlayerShape();
                        obstacles.erase(obstacles.begin() + i); --i;
                    } else {
                        gameOver = true;
                        std::cout << "Game Over! Score: " << score << "\nPress R to restart.\n";
                        break;
                    }
                }
            }
        }

        if(gameStarted) {
            drawShape(player);
            for(const auto& o : obstacles) drawShape(o);
        }

        static int frameCount = 0;
        if(++frameCount > 100) {
            std::cout << "Score: " << score << "\r" << std::flush;
            frameCount = 0;
        }

        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();
    return 0;
}
