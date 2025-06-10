package com.PetAdoption.Backend.repository;

import com.PetAdoption.Backend.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.util.List;

public interface ShelterRepository extends JpaRepository<Shelter, String> {
    List<Shelter> findByNameContainingIgnoreCase(String name);
    Page<Shelter> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
