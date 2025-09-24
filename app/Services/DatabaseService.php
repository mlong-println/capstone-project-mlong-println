<?php

namespace App\Services;

use PDO;
use PDOException;

/**
 * DatabaseService - Handles raw SQL database operations without Eloquent ORM
 * Provides secure, reusable database access layer with prepared statements
 */
class DatabaseService
{
    /** @var PDO Private database connection instance */
    private $pdo;

    /**
     * Constructor - Initializes database connection using environment variables
     * Sets up error handling and connection parameters
     */
    public function __construct()
    {
        try {
            // Get database credentials from .env file
            $host = env('DB_HOST');        // Database host (localhost)
            $db = env('DB_DATABASE');      // Database name (runconnect)
            $username = env('DB_USERNAME'); // Database user (root)
            $password = env('DB_PASSWORD'); // Database password

            // Create PDO instance with connection string and credentials
            $this->pdo = new PDO(
                "mysql:host=$host;dbname=$db",
                $username,
                $password
            );

            // Configure PDO to throw exceptions on errors
            // This helps catch SQL errors instead of silent failures
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch (PDOException $e) {
            throw new \Exception("Database connection failed: " . $e->getMessage());
        }
    }

    /**
     * Executes a raw SQL query with optional parameters
     * Uses prepared statements to prevent SQL injection
     *
     * @param string $sql    The SQL query to execute
     * @param array  $params Array of parameters to bind to the query
     * @return PDOStatement  The prepared and executed statement
     */
    public function executeQuery($sql, $params = [])
    {
        try {
            // Prepare the SQL statement for secure execution
            $stmt = $this->pdo->prepare($sql);
            
            // Execute with parameters (if any)
            $stmt->execute($params);
            
            return $stmt;
        } catch (PDOException $e) {
            throw new \Exception("Query execution failed: " . $e->getMessage());
        }
    }

    /**
     * Fetches a single row from the database
     * Useful for SELECT queries that should return one result
     *
     * @param string $sql    The SQL query to execute
     * @param array  $params Query parameters
     * @return array|false   Single row as associative array or false if no results
     */
    public function fetch($sql, $params = [])
    {
        $stmt = $this->executeQuery($sql, $params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Fetches all matching rows from the database
     * Useful for SELECT queries that return multiple results
     *
     * @param string $sql    The SQL query to execute
     * @param array  $params Query parameters
     * @return array        Array of rows as associative arrays
     */
    public function fetchAll($sql, $params = [])
    {
        $stmt = $this->executeQuery($sql, $params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}