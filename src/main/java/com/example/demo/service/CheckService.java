package com.example.demo.service;

import com.example.demo.repository.CheckRepository;
import com.example.demo.repository.ManageRepository;
import org.springframework.stereotype.Service;

@Service
public class CheckService {

    private final CheckRepository checkRepository;
    private final ManageRepository manageRepository;

    public CheckService(CheckRepository checkRepository, ManageRepository manageRepository) {
        this.checkRepository = checkRepository;
        this.manageRepository = manageRepository;
    }

    public Object selectVocDic() {
        return manageRepository.selectVocDic();
    }

}
