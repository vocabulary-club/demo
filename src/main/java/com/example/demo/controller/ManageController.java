package com.example.demo.controller;

import com.example.demo.service.ManageService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/manage")
public class ManageController {

    private final ManageService manageService;

    public ManageController(ManageService manageService) {
        this.manageService = manageService;
    }

    @PostMapping("/create")
    public Object create(@RequestBody Map<String, Object> data) {
        return manageService.create(data);
    }

    @PostMapping("/update")
    public Object update(@RequestBody Map<String, Object> data) {
        return manageService.update(data);
    }

    @PostMapping("/delete")
    public Object delete(@RequestBody Map<String, Object> data) {
        return manageService.delete(data);
    }

    @GetMapping("/select")
    public Object select() {
        return manageService.select();
    }
}